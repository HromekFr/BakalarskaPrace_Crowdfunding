<template>
  <nav class="navbar navbar-light bg-light">
        <div class="container">
          <router-link class="navbar-brand" to="/">
            <h1>DeCrowdfunding</h1>
          </router-link>
          <router-link class="navbar-brand" to="/">
            Home
          </router-link>
          <router-link class="navbar-brand" to="/create">
            Create project
          </router-link>
          <router-link class="navbar-brand" to="/about">
            About
          </router-link>
          <div class="navbar-brand">
            <button v-if="!$store.state.account" class="btn btn-primary" @click="connectEthereum">Connect Metamask</button>
            <p v-else class="btn btn-success connect-button">{{$store.state.account}}</p>
          </div>
        </div>
  </nav>
</template>

<script>
export default {
    name: "Navbar"

}
</script>

<style>
.connect-button {
  margin-bottom: 0px !important;
}
</style>