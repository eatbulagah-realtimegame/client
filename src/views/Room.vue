<template>
    <div>
        <h1>Score {{myPoints}}</h1>
        <div v-if="!gameOver">
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
                <div v-if="!gameOver && initialized" class="d-flex flex-column justify-content-center" >
                    <label for="">Your Answer</label>
                    
                    <input type="text" v-model="myAnswer" class="form-control">
                    <button class="btn btn-primary" type="">Submit</button>
                </div>
            </form>
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
            player1: '',
            player2: '',
            player1Info: '',
            player2Info: '',
            me: '',
            room: '',
            userId: '',
            myAnswer: '',
            realAnswer: 'ayams', //still hardcoded,
            myPoints: 0
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
            if(this.realAnswer === this.myAnswer) {
                let currentPoint = 0
                ref.once('value', function(snapshot) {
                    let refPoint = database.ref('room/' + self.room + '/users/' + self.userId + '/points')
                    currentPoint = snapshot.val().points + 1
                    refPoint.set(currentPoint)
                    self.checkPoints(currentPoint)
                })
                alert('BENAR')
            } else if(this.realAnswer.slice(0,4) === this.myAnswer.slice(0,4)) {
                alert('BISA JADI')
                this.myAnswer = ''
            } else {
                alert('BUKAN')
                this.myAnswer = ''
            }
        },
        checkPoints(point) {
            if(point >= 5) {
                this.myPoints = point
                alert('GAME SELESAI')
            } else {
                this.myPoints = point
                console.log(point)
                alert('dari check points'+point)
            }
        },
        // getQuestions(){
        //     let self = this
        //     return database.ref('questions').once('value')
        //     .then( snapshot = {
        //         let dataQuestions = snapshot.val()
        //         Object.keys
        //     })
        // },
    },
    created() {
        this.checkAllUsers()
    }
}
</script>

<style>

</style>
