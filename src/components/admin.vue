<template>
  <div id="app">
    <div v-if="!username">
      What's your name? <br />
      <input type="text" placeholder="Name" v-on:keyup.enter="updateUsername">
    </div>
    <div v-else>
      <div> Input Question </div>
      <div>
        <textarea name="" id="" cols="30" rows="10" placeholder="Question" v-model='soal'>
        </textarea>
        <textarea name="" id="" cols="30" rows="10" placeholder="Answer" v-model='jawaban'>
        </textarea>
      </div>
      <button type="button" @click.prevent="addQuestion">Add</button>
    </div>
  </div>
</template>


<script>
import database from "@/assets/config.js";

export default {
  name: "app",
  components: {},
  data(){
    return {
        username: '',
        soal: '',
        jawaban: ''
    }
  },
  created(){
    this.getQuestions()
  },
  methods:{
    updateUsername(e) {
        e.preventDefault();
        if(e.target.value){
            this.username = e.target.value;
        }
    },

    addQuestion() {
            const questionAnswer = {
                question: this.soal,
                answer: this.jawaban
            }
            console.log(questionAnswer)
            // To-Do: Push message to databasebase
            //Push message to databasebase reference
            database.ref('questions').push(questionAnswer);
            this.soal = ''
            this.jawaban = ''
    },
  }
  
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
