import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyCCFmcl5agS9IEG7m95mzXH4v6UUO_FTnw",
    authDomain: "chat-dua.firebaseapp.com",
    databaseURL: "https://chat-dua.firebaseio.com",
    projectId: "chat-dua",
    storageBucket: "chat-dua.appspot.com",
    messagingSenderId: "250446102499"
};

const database = firebase.initializeApp(config).database();

export default database;