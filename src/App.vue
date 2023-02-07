<template>
  <Navbar />
  <router-view/>
</template>

<script>
import store from "./store";
import Navbar from "./components/Navbar.vue"
export default {
  components: {
    Navbar
  },
  async mounted() {
    store.commit('CHANGE_PROJECTS_LOADED', false)
    await store.dispatch('connectEthereum')
    await store.dispatch('getProjects')
    store.commit('CHANGE_PROJECTS_LOADED', true)
  }

}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-right: 3rem;
  margin-left: 3rem;
}
</style>
