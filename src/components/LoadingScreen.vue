<template>
    <h1 style="text-align:center">Waiting for metamask confirmation or loading blockchain data</h1>
    <div class="center">
        <div class="lds-dual-ring"></div>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.center *{
margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid black;
  border-color: black transparent black transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>