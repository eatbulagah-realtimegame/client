<template>
    <div>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <b-card 
                            :img-src="imgUrl"
                            img-alt="Img"
                            img-top
                            >
                        
                        <div slot="footer">
                            <small class="text-muted"></small>
                        </div>
                    </b-card>
                </div>
                <div class="col-md-6">
                    <b-card bg-variant="info"
                            text-variant="white"
                            :header="currentPlayerName"
                            class="text-center">
                        <h4>Score {{myPoints}}</h4>
                        <form @submit.prevent="checkPrediction()">
                            <div v-if="!gameOver && initialized" class="d-flex flex-column justify-content-center mb-2" >
                                <label for="">Your Answer</label>
                                <input type="text" v-model="myAnswer" class="form-control">
                            </div>
                                <button class="btn btn-danger" type="">Submit</button>
                        </form>
                    </b-card>
                </div>
            </div>
        </div>
        
        <h1>Score {{myPoints}}</h1>
        <div v-if="!gameOver">
            <div class="bg-dark text-white">
                <p class="text-white">Input your answer : </p>
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
            myPoints: 0,
            imgUrl: 'https://storage.googleapis.com/client-trekshop/tidakSRT.gif.gif',
            images: [{
                name: 'bisajadi',
                url: 'https://storage.googleapis.com/client-trekshop/bisajadisrt.gif'
            }, {
                name: 'tidak',
                url: 'https://storage.googleapis.com/client-trekshop/tidakSRT.gif.gif'
            }, {
                name: 'ya',
                url: 'https://storage.googleapis.com/client-trekshop/hooray.gif'
            }]
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
                // alert('BENAR')
                this.imgUrl = this.images[2].url
                
            } else if(this.realAnswer.slice(0,4) === this.myAnswer.slice(0,4)) {
                // alert('BISA JADI')
                this.myAnswer = ''
                this.imgUrl = this.images[0].url
            } else {
                // alert('TIDAK')
                this.myAnswer = ''
                this.imgUrl = this.images[1].url
            }
        },
        checkPoints(point) {
            if(point >= 5) {
                this.myPoints = point
                alert('GAME SELESAI')
            } else {
                this.myPoints = point
                console.log(point)
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
