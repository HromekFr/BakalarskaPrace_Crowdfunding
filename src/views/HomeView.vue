<template>
  <div v-if="$store.state.projectsLoaded" class="home">
    <ProjectCards />
  </div>
  <div v-else>
    <LoadingScreen/>
  </div>
</template>

<script>
import ProjectCards from "@/components/ProjectCards.vue"
import LoadingScreen from "@/components/LoadingScreen.vue"

export default {
  name: 'HomeView',
  components: {
    ProjectCards,
    LoadingScreen
  },
}
</script>

<style>
.fund-details {
  display: flex;
  justify-content: space-between;
  margin: 10px;
}

.jumbotron {
  color: white;
  margin-block: 20px;
}
.jumbotron-image {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}


</style>
