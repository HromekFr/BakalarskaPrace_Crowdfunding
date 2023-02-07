<template>
    <div class="projectContainer">
        <div v-for="(project, index) in projects" :key="project" class="card-wrapper">
            <div v-if="index == 0">
                <div class="jumbotron jumbotron-image" :style="'background-image: linear-gradient(135deg, rgba(0,0,0, 0.73), rgba(117,117,117, 0.52)), url(https://ipfs.infura.io/ipfs/'+ project.details.projectImgHash +')'">
                    <div class="title-stripe">
                        <router-link class="link-title" :to="{ name: 'detail', params: {index: index}}">
                            <h1 class="display-4 jumbo-title">{{project.details.projectTitle}}</h1>
                        </router-link>
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
                    <div class="jumbo-desc">
                        <p class="lead">{{project.details.projectDesc}}</p>
                        <p>From: {{project.details.projectOwner}}</p>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" :style="`width:` + calculateBar(project.details.currentAmount,project.details.projectGoalAmount) + `%;`" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{{calculateBar(project.details.currentAmount,project.details.projectGoalAmount)}} %</div>
                        </div>
                    </div>
                    <div class="fund-details">
                        <p>Currently raised: {{formatEther(project.details.currentAmount)}} ETH</p>
                        <p>Goal: {{formatEther(project.details.projectGoalAmount)}} ETH</p>
                        <p>Valid until: {{remainingTime(project)}}</p>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="card col-md-4 h-100" style="width: 18rem;">
                    <div class="card-body">
                        <img class="card-img-top" :src="'https://ipfs.infura.io/ipfs/'+ project.details.projectImgHash" :alt="project.details.projectTitle">
                        <div class="title-stripe">
                            <p v-if="project.details.currentState == 0" class="card-text btn btn-primary state-logo">Fundraising</p>
                            <p v-if="project.details.currentState == 1" class="card-text btn btn-warning state-logo">Expired</p>
                            <p v-if="project.details.currentState == 2" class="card-text btn btn-success state-logo">Successfull</p>
                            <img class="category-img" v-if="project.details.projectCategory == 'games'" src="@/assets/console.png" :alt="project.details.projectCategory">
                            <img class="category-img" v-if="project.details.projectCategory == 'books'" src="@/assets/open-book.png" :alt="project.details.projectCategory">
                            <img class="category-img" v-if="project.details.projectCategory == 'music'" src="@/assets/musical-note.png" :alt="project.details.projectCategory">
                            <img class="category-img" v-if="project.details.projectCategory == 'video'" src="@/assets/video.png" :alt="project.details.projectCategory">
                        </div>
                        <router-link class="link-title" :to="{ name: 'detail', params: {index: index}}">
                            <h5 class="card-title">{{project.details.projectTitle}}</h5>
                        </router-link>
                        <h6 class="card-subtitle mb-2 text-muted">Project owner : {{project.details.projectOwner.substring(0,4)}}...</h6>
                        <p class="card-text">Description : {{project.details.projectDesc.substring(0,80)}}...</p>
                        <p class="card-text" v-if="project.details.currentState == 0">Valid until {{ remainingTime(project)}}</p>
                        <p class="card-text" v-if="project.details.currentState == 1">Project already expired</p>
                        <div class="progress progress-card">
                            <div v-if="project.details.currentState == 0 || project.details.currentState == 1" class="progress-bar" role="progressbar" :style="`width:` + calculateBar(project.details.currentAmount,project.details.projectGoalAmount) + `%;`" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{{calculateBar(project.details.currentAmount,project.details.projectGoalAmount)}} %</div>
                            <div v-if="project.details.currentState == 2" class="progress-bar" role="progressbar" style="width: 100%">100%</div>
                        </div>
                        <p v-if="project.details.currentState == 0 || project.details.currentState == 1"  class="card-text">Currently raised: {{formatEther(project.details.currentAmount)}} ETH</p>
                        <p class="card-text">Goal : {{formatEther(project.details.projectGoalAmount)}} ETH</p>
                    </div>
                </div>
            </div>
    </div>
</div>
</template>

<script>
import store from "@/store"
import { ethers } from "ethers";
export default {
    computed: {
        projects() {
            return store.state.projects
        },
    },
    methods: {
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
        formatEther(amount) {
            return ethers.utils.formatEther(amount)
        },
        calculateBar(currentAmount, goalAmount) {
            return Math.ceil((this.formatEther(currentAmount) / this.formatEther(goalAmount)) * 100)
        },

    }
}
</script>

<style>
.projectContainer {
    display: flex;
    flex-wrap: wrap;
}

.card-wrapper {
    margin: 20px 40px 20px 0;
}


.card-img-top {
    display: flex;
    justify-content: space-around;
    height: 180px;
    margin-bottom: 20px;
}

.card {
    width: 18rem;
    min-height: 36rem;
}


.link-title {
    text-decoration: none;
    color: inherit;
    outline: 0;
}

.title-stripe {
    display: flex;
    justify-content: space-between;
}

.category-img {
    align-self: center;
    padding-right: 20px;
    max-width: 64px;
    max-height: 64px;
    padding-bottom: 15px;
}

.state-logo {
 align-self: center;
 margin-right: 20px;
}

.progress-card {
    margin-bottom: 15px;
}

.jumbo-title {
    padding-left: 10px;
}

.jumbo-desc {
    padding-left: 20px;
    padding-right: 20px;
}
</style>