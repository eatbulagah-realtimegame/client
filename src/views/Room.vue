<template>
    <div>
        <h2>{{isPlaying}}</h2>
        <h1>Score {{myPoints}}</h1>
        <div v-if="isPlaying">
            <div class="bg-dark text-white">
                <p class="text-white">Currently playing: </p>
                {{ currentPlayerName }}
            </div>
            <div class="bg-darkn text-white">

                <p class="waiting bg-dark text-white" v-if="initialized === false">Waiting for opponent
                    <span>
                        <div class="loader">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                        </div>
                    </span>
                </p>
            </div>
            <form @submit.prevent="checkPrediction()">
                <div v-if="isPlaying && initialized" class="d-flex flex-column justify-content-center" >
                    <label for="">Your Answer</label>
                    
                    <input type="text" v-model="myAnswer" class="form-control">
                    <button class="btn btn-primary" type="">Submit</button>
                </div>
            </form>
            <div>
                {{keyQuestion}}
                {{selectedQuestion.question}} <br>
                {{selectedQuestion.answer}}
            </div>
        </div>
        <div v-if="!isPlaying">
            WINNER : {{winner}}
        </div>
    </div>
</template>

<script>
import database from '../assets/config';

export default {
    name: 'room',
    data() {
        return {
            currentPlayerName: localStorage.getItem('username'),
            initialized: false,
            gameOver: false,
            isPlaying: true,
            player1: '',
            player2: '',
            player1Info: '',
            player2Info: '',
            me: '',
            room: '',
            userId: '',
            myAnswer: '',
            selectedQuestion : {
                question: '',
                answer: ''
            },
            keyQuestion: '',
            myPoints: 0,
            winner: '',
            listQuestions: [],
            roomNow: localStorage.getItem('room')
        }   
    },
    methods: {
        checkAllUsers() {
            let currentRoom = localStorage.getItem('room');
            let userId = localStorage.getItem('userid');
            this.room = currentRoom;
            this.userId = userId;
            console.log('check', this.userId)
            let dbRoom = database.ref('room/' + this.room);
            let self = this
            dbRoom.on('value', function(snapshot) {
                let arrUsers = snapshot.val().users;
                if(Object.keys(arrUsers).length === 2) {
                    self.player1 = Object.keys(arrUsers)[0];
                    self.player1Info = Object.values(arrUsers)[0];
                    self.player2 = Object.keys(arrUsers)[1];
                    self.player2Info = Object.values(arrUsers)[1];

                    if(self.player1 == localStorage.getItem('userId')) {
                        self.me = self.player1Info
                    } else {
                        self.me = self.player2Info
                    }
                self.initialized = true
                }
            })
        },
        checkPrediction() {
            let self = this
            let ref = database.ref('room/' + self.room + '/users/' + this.userId)
            if(this.selectedQuestion.answer === this.myAnswer) {
                let currentPoint = 0
                ref.once('value', function(snapshot) {
                    let refPoint = database.ref('room/' + self.room + '/users/' + self.userId + '/points')
                    currentPoint = snapshot.val().points + 1
                    refPoint.set(currentPoint)
                    self.myPoints = currentPoint
                    self.checkPoints(currentPoint)
                    self.removeQuestion()
                })
                //ganti jawaban
            } else if(this.selectedQuestion.answer.slice(0,4) === this.myAnswer.slice(0,4)) {
                alert('BISA JADI')
                this.myAnswer = ''
            } else {
                alert('BUKAN')
                this.myAnswer = ''
            }
        },
        removeQuestion() {
            let self = this
            return new Promise((resolve, reject) => {
                database.ref('room/' + self.room + '/questions/' + self.keyQuestion).remove()
                resolve()
            })
        },
        checkPoints(point) {
            let self = this
            if(point >= 5) {
                // this.winner = this.currentPlayerName
                // this.gameOver = true
                database.ref('room/' + self.room + '/isPlaying/status').set(false)
                database.ref('room/' + self.room + '/winner').set(self.currentPlayerName)

                alert('GAME SELESAI')
            } else {
                console.log(point)
                alert('dari check points'+point)
            }
        },
        getQuestions(){
            let self = this
            self.listQuestions = []
            return database.ref('room/' + self.roomNow + '/questions').once('value')
            .then( snapshot => {
                let dataQuestions = snapshot.val()
                console.log("+++++====")
                console.log(dataQuestions)
                Object.keys(dataQuestions).forEach( key => {
                    self.listQuestions.push({
                        key: key,
                        question: dataQuestions[key].question,
                        answer: dataQuestions[key].answer
                    })
                })
                
                self.selectedQuestion = self.listQuestions[0]
                self.keyQuestion = self.listQuestions[0].key
                console.log('new KEY', self.keyQuestion)
                console.log('new Quest', self.selectedQuestion)
                // console.log('=======')
                // console.log(self.listQuestions)
                // self.randomQuestion()
            })
        },
        // randomQuestion(){
        //     this.selectedQuestion = this.listQuestions[Math.floor(Math.random()*4)]
        //     console.log(this.selectedQuestion)
        // }
    },
    created() {
        let self = this
        this.checkAllUsers()
        this.getQuestions()
        database.ref('room/' + self.roomNow + '/questions').on('value', function(snapshot) {
            self.getQuestions()
        })
        database.ref('room/' + self.room + '/users/' + this.userId).on('value', function(snapshot) {
            self.myPoints = snapshot.val().points
        })
        database.ref('room/' + self.room + '/isPlaying').on('value', function(snapshot) {
            self.isPlaying = snapshot.val().status
        })
        database.ref('room/' + self.room + '/winner').on('value', function(snapshot) {
            self.winner = snapshot.val()
        })
    }
}
</script>

<style>

</style>
