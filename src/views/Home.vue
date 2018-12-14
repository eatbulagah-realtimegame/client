<template>
    <div class="home">
        <div class="mt-4 mb-5 d-flex align-items-center justify-content-center mr-5">
            <div class="display-3">EATBULAGA || {{room2}}</div>
        </div>
        <div class="alert mb-0 container col-7" id="alert-subtitle">
            <h3 id="subtitle">Maen jempol yuks!</h3>
        </div>
        <div class="d-flex justify-content-center align-items-center mb-4 col-9 m-auto p-3 rounded" id="divroom">
            <div class="mr-5 d-flex align-items-center">
                <div class="lead mr-5">Playing Rooms</div> 
                <i class="fas fa-arrow-circle-right"></i>
            </div>
            <div class="ml- mr-5" id="listroom" v-if="roomList2.length > 0">
                <div id="oneroom" @click="chooseRoom2(single)" v-for="(single, index) in roomList2" :key="index"> {{single}}</div>
            </div>
            <div class="col-6">
                <form @submit.prevent="setRoom">
                    <input type="text" class="form-control" placeholder="Room" v-model="room"><br>
                    <button class="btn btn-outline-dark" id="btn-room">Enter Room</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import database from '@/assets/config';
import { mapState } from 'vuex'

export default {
    name: 'home',
    data() {
        return {
            room: '',
            name: ''
            // roomList: []
            listQuestions: [],
            selectedQuestion: {}
        }
    },
    computed : mapState({
        roomList2: state => state.roomList2,
        room2: state => state.room2,
        nameState () {
        return this.name.length > 3 ? true : false
        }
    }),
    methods: {
        // chooseRoom: function(chosenRoom) {
        //     this.room = chosenRoom;
        // },
        chooseRoom2 (choosenRoom) {
            this.$store.dispatch('chooseRoom', choosenRoom)
            this.room = this.room2
        },
        setRoom: function() {
            let self = this;
            if (self.room) {
                //kalo nama room udah diketik
                let thumbRoom = database.ref('room/' + self.room);
                thumbRoom.once('value', function(snapshot) { 
                    let result = snapshot.val();
                    //ngecek value dari room
                    console.log('check room', result);
                    if (!result) {
                        //kalo ga ada isinya, kita set inisalisasi
                        self.getQuestions()
                            .then(() => {
                                database.ref('room/' + self.room).set({
                                    name: self.room,
                                    
                                    isPlaying: { "status" : true}
                                })
                                    .then(response => {
                                        console.log(self.listQuestions)
                                        self.listQuestions.forEach( (e, index) => {
                                            database.ref('room/' + self.room + '/questions/soal' + index).set({
                                                question : e.question,
                                                answer: e.answer
                                            })
                                        });
                                        //console.log('set room name', response);
                                        localStorage.setItem('room', self.room);
                                        //self.$router.push('login');
                                        self.$router.push('login');
                                    })
                                    .catch(function(err) {
                                        console.log('Set Room Name Error: ', err);
                                    });
                            })
                            .catch(() => {
                                console.log('gagal maning')
                            })
                    } else {
                        //kalo udah ada isinya
                        let roomUsers = result.users;
                        //kalo pertama masuk undefined masukin nama baru keitung masuk
                        console.log(roomUsers)
                        if (roomUsers && Object.keys(roomUsers).length >= 2) {
                            localStorage.removeItem('room');
                            alert('Full Room. Please choose another!')
                        } else {
                            localStorage.setItem('room', self.room);
                            //self.$router.push('login');
                            self.$router.push('login');
                        }
                    }
                });
            }
        },
        // getAllRoom: function() {
        //     let self = this;
        //     database.ref('room/').on('value', function(snapshot) {
        //         console.log('get all rooms', snapshot.val());
        //         let result = snapshot.val();
        //         self.roomList = Object.keys(result);
        //         console.log('self',self.roomList)
        //     });
        // },
        getAllRoom2 () {
            this.$store.dispatch('getAllRoom')
        },

        getQuestions(){
            let self = this
            return new Promise ((resolve, reject) => {
                database.ref('questions').once('value', function(snapshot) {
                    let dataQuestions = snapshot.val()
                    Object.keys(dataQuestions).forEach( key => {
                        self.listQuestions.push({
                            question: dataQuestions[key].question,
                            answer: dataQuestions[key].answer
                        })
                    })
                    // let keys = Object.keys(dataQuestions)
                    self.listQuestions = self.shuffle(self.listQuestions)
                    console.log(self.listQuestions)
                    console.log('=======')
                    // self.randomQuestion()
                    resolve()
                })
            })
        },
        randomQuestion(){
            this.selectedQuestion = this.listQuestions[Math.floor(Math.random()*4)]
            console.log('ey',this.selectedQuestion)
        },
        shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

    },
    created() {
        //this.getAllRoom();
        this.getAllRoom2()

    }
}
</script>

<style scoped>
input, button {
  width: 100%;
  text-align: center;
}

#oneroom:hover {
  background-color: #003366;
  cursor: pointer;
}

#divroom {
  background-color: rgb(134, 5, 5);
  color: white;
}

#btn-room {
  background-color: black;
  border: none !important;
  color: white;
}

#btn-room:hover {
  background-color: #ffa500;
  border: none !important;
  color: white;
}

</style>
