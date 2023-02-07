<template>
  <ProjectDetails v-if="$store.state.projectsLoaded" />
  <div v-else>
    <h1>Loading project details</h1>
  </div>
</template>

<script>
import ProjectDetails from "@/components/ProjectDetails.vue"
import store from "@/store"
export default {
    name: 'DetailView',
    components: {
        ProjectDetails
    }
}
</script>

<style>

</style>