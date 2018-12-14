<template>
    <div>
        <!-- <h2>{{isPlaying}}</h2> -->
        <div class="container">
            
            <div class="row" v-if="isPlaying">
                <div class="bgwhite mb-4">
                    <h1>{{selectedQuestion.question}}</h1>
                </div>
                <div class="col-md-6">
                    <b-card 
                            :img-src="imgUrl"
                            img-alt="Img"
                            img-top
                            >
                        <input type="text" v-model="myAnswer" class="form-control input-lg">
                        <audio ref="bisajadi" src="https://storage.googleapis.com/shinemodyste/bisajadi.mp3" ></audio>
                        <audio src="https://storage.googleapis.com/shinemodyste/tidak.mp3" ref="tidak"></audio>
                        <audio src="https://storage.googleapis.com/shinemodyste/iya.mp3" ref="ya"></audio>
                    </b-card>
                </div>
                <div class="col-md-6">
                    <b-card bg-variant="info"
                            text-variant="white"
                            :header="'Player: '+currentPlayerName"
                            class="text-center">
                        <h4>Score {{myPoints}}</h4>
                        <form @submit.prevent="checkPrediction()">
                            <div v-if="isPlaying && initialized" class="d-flex flex-column justify-content-center mb-2" >
                                <label for="">Your Answer</label>
                                <input type="text" v-model="myAnswer" class="form-control">
                            </div>
                                <button class="btn btn-danger" type="">Submit</button>
                        </form>
                    </b-card>
                </div>
            </div>
            <div class="row justify-content-center" v-if="!isPlaying">
                <div class="col-md-12 bgwhite m-auto" v-if="currentPlayerName == winner">
                    <h1>Congrats! You're the Winner</h1>
                    <img src="https://storage.googleapis.com/client-trekshop/celebration.gif" width="1000px" alt="">
                </div>
                <div class="bgwhite" v-if="currentPlayerName !== winner">
                    <h1>You Lose! Better luck next time!</h1>
                    <img src="https://storage.googleapis.com/client-trekshop/youlose.gif" width="500px" alt="" srcset="">
                </div>
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
            roomNow: localStorage.getItem('room'),
            realAnswer: 'ayams', //still hardcoded,
            imgUrl: 'https://storage.googleapis.com/client-trekshop/tebak.gif',
            images: [{
                name: 'bisajadi',
                url: 'https://storage.googleapis.com/client-trekshop/bisajadisrt.gif'
            }, {
                name: 'tidak',
                url: 'https://storage.googleapis.com/client-trekshop/tidakSRT.gif.gif'
            }, {
                name: 'ya',
                url: 'https://storage.googleapis.com/client-trekshop/hooray.gif'
            }, {
                name: 'tebak',
                url: 'https://storage.googleapis.com/client-trekshop/tebak.gif'
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
                // alert('BENAR')
                this.imgUrl = this.images[2].url
                this.$refs.ya.play()

                this.myAnswer = ''
                setTimeout(()=>{
                    this.imgUrl = this.images[3].url
                }, 2500)
                
                
            } else if(this.selectedQuestion.answer.slice(0,4) === this.myAnswer.slice(0,4)) {
                // alert('BISA JADI')
                this.myAnswer = ''
                this.imgUrl = this.images[0].url
                // this.$('#bisaJadi').play()
                this.$refs.bisajadi.play()
                setTimeout(()=>{
                    this.imgUrl = this.images[3].url
                }, 2500)
                
            } else {
                // alert('TIDAK')
                this.myAnswer = ''
                this.imgUrl = this.images[1].url
                this.$refs.tidak.play()

                setTimeout(()=>{
                    this.imgUrl = this.images[3].url
                }, 1500)
                
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

                // alert('GAME SELESAI')
            } else {
                console.log(point)
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
    .bgwhite{
        background-color: antiquewhite;
        width: 100%;
        height: 100%;
    }
</style>
