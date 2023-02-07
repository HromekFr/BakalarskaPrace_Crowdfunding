<template>
<div class="detailsContainer" v-if="$store.state.projectsLoaded">
    <img :src="'https://ipfs.infura.io/ipfs/'+ project.details.projectImgHash" alt="" class="img-detail">
    <div class="title-stripe">
        <h1>{{project.details.projectTitle}}</h1>
        <div class="title-stripe">
            <p v-if="project.details.currentState == 0" class="card-text btn btn-primary state-logo">Fundraising</p>
            <p v-if="project.details.currentState == 1" class="card-text btn btn-warning state-logo">Expired</p>
            <p v-if="project.details.currentState == 2" class="card-text btn btn-success state-logo">Successfull</p>
            <img class="category-img" v-if="project.details.projectCategory == 'games'" src="@/assets/console.png" :alt="project.details.projectCategory">
            <img class="category-img" v-if="project.details.projectCategory == 'books'" src="@/assets/open-book.png" :alt="project.details.projectCategory">
            <img class="category-img" v-if="project.details.projectCategory == 'music'" src="@/assets/musical-note.png" :alt="project.details.projectCategory">
            <img class="category-img" v-if="project.details.projectCategory == 'video'" src="@/assets/video.png" :alt="project.details.projectCategory">
        </div>
    </div>
    <h3>Project starter : {{project.details.projectOwner}}</h3>
    <p>{{project.details.projectDesc}}</p>
    <p>Valid until: {{ remainingTime(project)}}</p>
    <p>Currently raised: {{formatEther(project.details.currentAmount)}} ETH</p>
    <p>Goal : {{formatEther(project.details.projectGoalAmount)}} ETH</p>
    <p c></p>
    <FundProjectForm/>
    <div class="funders-table">
        <h3>List of funders</h3>
        <table class="table">
            <thead>
                <tr>
                <th scope="col">Account address</th>
                <th scope="col">Amount funded</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="funders in project.contributorsValue" :key="funders">
                <th scope="row">{{funders.address}}</th>
                <td>{{funders.value}}</td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import store from "@/store"
import FundProjectForm from "./forms/FundProjectForm.vue"
import { ethers } from "ethers";
export default {
    computed: {
        project() {
                return store.state.projects[this.$route.params.index]
        }
    },
    components: { FundProjectForm },
    methods: {
        formatEther(amount) {
            return ethers.utils.formatEther(amount)
        },
        remainingTime(project) {
            const MS_PER_DAY = 1000 * 60 * 60 * 24;
            const MS_PER_HOUR = 1000 * 60 * 60;

            let now = new Date()
            let deadline = new Date(project.details.projectDeadline * 1000)

            const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
            const utcDeadline = Date.UTC(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());

            let remainingTime = `${(utcDeadline - utcNow) / MS_PER_DAY} days`

            if((utcDeadline - utcNow) / MS_PER_DAY <= 2) {
                remainingTime = `${(utcDeadline - utcNow) / MS_PER_HOUR} hours`
            }

            return remainingTime
        },
    }
}
</script>

<style>
.detailsContainer {
    display: flex;
    flex-direction: column;
    margin-right: 10%;
    margin-left: 10%;
}

.funders-table {
    margin-top: 20px;
}

.img-detail {
    height: 400px;
}
</style>