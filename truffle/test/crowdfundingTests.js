const Crowdfunding = artifacts.require("Crowdfunding");
const Project = artifacts.require("Project");
const { assert } = require('console');
const truffleAssert = require('truffle-assertions');

contract("Crowdfunding and Project", async (accounts) => {
    let contractCrowdfund;
    let contractProject;
    let projectContractAddress;
  
    it("Should deploy smart contract", async () => {
        contractCrowdfund = await Crowdfunding.deployed();
        assert(contractCrowdfund.address != '');
    });

    it("Let user create project and emit ProjectCreated event", async () => {
        const createProjectTx = await contractCrowdfund.createProject("Title","description",60,20,"QmTBgYab4Dx2w2wUidrces4XNkXZuBBJWGbWCZgh8WF86n","games", {'from' : accounts[0]})
        
        truffleAssert.eventEmitted(createProjectTx, 'ProjectCreated', (ev) => {
            projectContractAddress = ev.contractAddress;
            return ev.projectTitle === 'Title';
        });

        contractProject = await Project.at(projectContractAddress);
    });

    it("Should let contribute user from different address and emit event FundingReceived", async () => {
        const contributeTx = await contractProject.contribute({'from':accounts[1], 'value': 10})

        let valueFromMapping = await contractProject.contributions(accounts[1]);
        assert(valueFromMapping.words[0] === 10)

        truffleAssert.eventEmitted(contributeTx, 'FundingReceived', (ev) => {
            return ev.contributor == accounts[1] && ev.amount.words[0] == 10;
        });
    });

    it("Should not let contribute the owner of the project", async () => {
        await  truffleAssert.fails(contractProject.contribute({'from':accounts[0], 'value': 10}), truffleAssert.ErrorType.REVERT);
    });

    it("Should emit CreatorPaid event and change the state of the project to Successfull", async () => {
        const contributeTx = await contractProject.contribute({'from':accounts[1], 'value': 10})
        truffleAssert.eventEmitted(contributeTx, 'CreatorPaid', (ev) => {
            return ev.recipient == accounts[0];
        });

        let state = await contractProject.state();
        assert(state.words[0] == 2)
    });
});