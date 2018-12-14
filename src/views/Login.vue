<template>
  <div class="about">
    <div class="mb-5 d-flex align-items-center justify-content-center">
        <div class="mt-5 display-3">Welcome to room {{room}} </div>
    </div>

    <div class="container mb-4 m-auto p-3 rounded group" id="divroom">
        <div class="col-md-12">
            <h5> Enter your name</h5>
            <input class="form-control mt-5" type="text" v-model="username" placeholder="Player name">
            <button  class="btn btn-outline-dark mt-2" @click="login" id="btn-room">Login</button>
            <br><br>
            <p class="note"> {{notif}} </p>
        </div>

    </div>
  </div>
</template>

<script>
import database from '../assets/config';

export default {
    name: 'login',
    data() {
        return {
            room: '',
            username: '',
            notif: ''
        }
    },
    methods: {
        login: function() {
            let self = this;
            if (self.username === '') {
                this.notif = 'Enter your name first';
            } else {
                database.ref('room/' + self.room + '/users').push({
                    username: self.username,
                    points: 0,
                })
                    .then(response => {
                        localStorage.setItem('userid', response.key);
                        localStorage.setItem('username', self.username);
                        self.username = '';
                        self.$router.push('/room');
                    })
                    .catch(function(err) {
                        console.log('Push User To Room Error: ', err);
                    });
            }
        },
        checkRoom: function() {
            this.room = localStorage.getItem('room');
            console.log('room', this.room);
        }
    },
    created() {
        this.checkRoom();
    }
}
</script>

<style scoped>
#divroom {
  font-family: 'Ubuntu'; 
  background-color: rgba(161, 142, 31, 0.829);
  color: white;
}
.display-3{
  font-size: 2em;
  color: aliceblue;
  font-family: 'Chelsea Market', cursive;
  margin-bottom: 30px;
}

.about {
  margin: 0 auto;
  width: 500px;
}

input, button {
  width: 100%;
  text-align: center;
}
#btn-room {
  background-color: rgb(182, 17, 17);
  border: none !important;
  color: white;
}

#btn-room:hover {
  background-color: #ffa500;
  border: none !important;
  color: white;
}
.note {
  color: red;
}
</style>