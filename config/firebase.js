import firebase from 'firebase';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDSXL5WXfWCfl8kz1Bzne7xkBDoZzjlEtE",
  authDomain: "anonibusnovo.firebaseapp.com",
  databaseURL: "https://anonibusnovo.firebaseio.com",
  projectId: "anonibusnovo",
  storageBucket: "anonibusnovo.appspot.com",
  messagingSenderId: "1043909288241",
  appId: "1:1043909288241:web:465be6029c7bce0fa45010"
};
6796
export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app(); 