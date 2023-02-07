import { createStore } from 'vuex'
import { ethers } from 'ethers'
import CrowdfundingInstance from '@/instances/CrowdfundingInstance'
import ProjectInstance from '@/instances/ProjectInstance'
import { markRaw } from 'vue'
import router from '@/router'
import { create } from 'ipfs-http-client'


export default createStore({
  state: {
    provider: null,
    signer: null,
    account: null,
    projects: [],
    loading: false,
    currentCID: null,
    projectsLoaded: false
  },
  getters: {
  },
  mutations: {
      UPDATE_USER(state, payload) {
        state.provider = payload.provider
        state.signer = payload.signer
        state.account = payload.account
      },
      PUSH_PROJECT(state, project) {
        state.projects.push(project)
      },
      CLEAR_PROJECTS(state) {
        state.projects = []
      },
      CHANGE_LOADING(state, value) {
        state.loading = value
      },
      CHANGE_CID(state, value) {
        state.currentCID = value
      },
      CHANGE_PROJECTS_LOADED(state, value) {
        state.projectsLoaded = value
      }

  },
  actions: {
    async connectEthereum({commit}) {
        try {
            let ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
            let provider = markRaw(ethersProvider)
            if(!provider) {
                throw Error("Metamask not installed")
            }
    
            await provider.send("eth_requestAccounts", [])
            let signer = provider.getSigner()
            let account = await signer.getAddress()

            commit('UPDATE_USER', {provider, signer,account})
        } 
        catch(error) {
          console.log(error)
        }
      },
      async getProjects({state, commit}) {
        commit('CLEAR_PROJECTS')
        const crowdfundInstance = CrowdfundingInstance(state.provider)
        crowdfundInstance.returnAllProjects().then((projects) => {
          projects.forEach((address) => {
            const projectInstance = ProjectInstance(state.signer, address)
            projectInstance.getDetails().then((details) => {
              const project = new Object();
              project.details = details
              project.contract = projectInstance;
              let contributorsValue = [];
              project.details.projectContributors.forEach((address) => {
                projectInstance.returnContributorValue(address).then((res) => {
                  const value = new Object();
                  value.address = address;
                  value.value = ethers.utils.formatEther(res.toString())
                  contributorsValue.push(value)

                })
              })
              project.contributorsValue = contributorsValue
              commit('PUSH_PROJECT', project)
            })
          })
        }) 

      },


      async createProject({state, dispatch, commit}, {newProject}) {
        await dispatch('uploadFile', newProject.file)
        const crowdfundInstance = CrowdfundingInstance(state.signer)
        try {
          await crowdfundInstance.createProject(
            newProject.title,
            newProject.desc,
            newProject.duration,
            ethers.utils.parseEther(newProject.amount.toString()),
            state.currentCID,
            newProject.category).then(() =>{
              commit('CHANGE_LOADING', false)
              router.push('/')
            })    
        } catch (error) {
          commit('CHANGE_LOADING', false)
          console.log(error);
        }
      },

      async fundProject({state,dispatch}, data) {
        let goalAmount = Number.parseFloat(ethers.utils.formatEther(state.projects[data.index].details.projectGoalAmount))
        let currentlyRaised = Number.parseFloat(ethers.utils.formatEther(state.projects[data.index].details.currentAmount))
        let sendAmount = Number.parseFloat(data.value)

        if(currentlyRaised + sendAmount > goalAmount) {
          console.log("You are trying too send too much money")
        }
        else {
          await state.projects[data.index].contract.contribute({value:  ethers.utils.parseEther(data.value.toString())})
          router.push('/')
        }
      },
      async getRefund({state}, index) {
        await state.projects[index].contract.getRefund()
      },
      
      async uploadFile({commit}, file) {
        const client = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
        commit('CHANGE_LOADING', true)
        try {
          await client.add(file).then((res) => {
            commit('CHANGE_CID', res.path)
          })
        }
        catch(err) {
          console.log(err)
          commit('CHANGE_LOADING', false)
        }
      }
  },
  modules: {
  }
})
