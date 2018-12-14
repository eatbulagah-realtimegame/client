<template>
  <div id="app">
    <router-view/>
     <audio :src="audio_src" autoplay loop>
      Your browser does not support the audio element.
    </audio> 
  </div>
</template>

<script>
export default {
  data() {
    return { 
      audio_src : 'https://storage.googleapis.com/shinemodyste/backsound.mp3'
    }
  }
}
</script>

<style>
#app {
  background-image: url('assets/img/headers.jpg');
  background-size: cover;
  width: 100vw;
  height: 100vh;
}
</style>


