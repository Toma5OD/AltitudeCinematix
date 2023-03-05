import firebase from 'firebase/app';
import 'firebase/database';

export const firebaseConfig = {
    apiKey: "AIzaSyByFnJuj8qpCj-DxNa7OvSHfgHbWmy76B4",
    authDomain: "altitudecinematix.firebaseapp.com",
    databaseURL: 'https://altitudecinematix-default-rtdb.europe-west1.firebasedatabase.app/',
    projectId: "altitudecinematix",
    storageBucket: "altitudecinematix.appspot.com",
    messagingSenderId: "149776768071",
    appId: "1:149776768071:web:cca25ad9f043b59f28a562",
    measurementId: "G-3WHKJQZ9SZ"
  };

  
firebase.initializeApp(firebaseConfig);

export default firebase;