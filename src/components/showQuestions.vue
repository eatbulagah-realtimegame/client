<template>
  <div id="app">
    <div v-if="!username">
      You can't play without a name. What's your name? <br />
      <input type="text" placeholder="Name" v-on:keyup.enter="updateUsername">
    </div>
    <div v-else>
      <div>
        <h3>Player: {{this.username}}</h3>
        <br>
        <h4>Question: </h4>
        <strong>{{this.questionNow.question}}</strong>
      </div>
      <br>
      <form v-on:submit.prevent="submitanswer">
        <input type="text" placeholder="Fill Your Answer" v-model='myanswer'>
        <button>Submit</button>
      </form>

      {{this.message}}

    </div>
  </div>
</template>


<script>
<<<<<<< HEAD
import database from "@/assets/config.js";
=======
import fire from "../mykey.js";
>>>>>>> anhar

export default {
  name: "app",
  components: {},
  data(){
    return {
      username: '',
      soal: '',
      jawaban: '',
      message: '',
      questions: [],
      questionNow: {},
      myanswer: ''
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

    getQuestions(){
      let self = this
      return database.ref('questions').once('value')
      .then(function(snapshot) {
        let dataQuestions = snapshot.val()
        let questionlist = []
        Object.keys(dataQuestions).forEach(key => {
          questionlist.push({
            question: dataQuestions[key].question,
            answer: dataQuestions[key].answer
          })
        })
        self.questions = questionlist
        self.playgame()
      });
    },
    
    submitanswer(){
      if(this.myanswer === this.questionNow.answer){
        this.message = 'benar'
        setTimeout(() => {
          this.message = ''
          this.playgame()
        }, 2000);
      } else if(this.myanswer.slice(0,4) === this.questionNow.answer.slice(0,4)){
        this.message = 'bisa jadi'
        setTimeout(() => {
          this.message = ''
        }, 2000);
      } else {
        this.message = 'salah'
        setTimeout(() => {
          this.message = ''
        }, 2000);
      }
    },

    playgame(){
      this.questionNow = this.questions[Math.floor(Math.random()*5)]
      console.log(this.questionNow)
    }
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
