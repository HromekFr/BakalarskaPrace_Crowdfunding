<template>
<div v-if="project.currentState == 0">
    <div v-if="$store.state.account != project.projectOwner">
        <form @submit.prevent="handleFund">
            <div class="form-group">
                <label for="fundAmout">Amount in ETH</label>
                <input class="form-control" type="number" step=".01" v-model="fundAmount" id="fundAmount">
            </div>
            <button type="submit" class="btn btn-primary submit-button">Send funding</button>
        </form>
    </div>
    <div v-else>
        <p>You can't fund your own project</p>
    </div>
</div>

<div v-if="project.currentState == 1">
    <p>Project already expired</p>
    <button type="submit" class="btn btn-primary" @click="handleRefund">Get refund</button>
</div>

</template>

<script>
import store from "@/store"
export default {
    data() {
        return {
            fundAmount: 0
        }
    },
    computed: {
        project() {
            return store.state.projects[this.$route.params.index].details;
        }
    },
    methods: {
        handleFund() {
            store.dispatch('fundProject', {index: this.$route.params.index, value: fundAmount.value})
            },
        handleRefund() {
            store.dispatch('getRefund', this.$route.params.index)
        }
    }
}
</script>

<style>
.submit-button {
    margin-top: 20px !important;
}
</style>