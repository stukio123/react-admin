import firebase from "firebase/app";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDHLGN58Ld2gtTao7PMwMElYrQDLA54SGE",
  authDomain: "content-delivery-b57b7.firebaseapp.com",
  databaseURL: "https://content-delivery-b57b7.firebaseio.com",
  projectId: "content-delivery-b57b7",
  storageBucket: "content-delivery-b57b7.appspot.com",
  messagingSenderId: "128698018952",
  appId: "1:128698018952:web:69c547ece616938e4e033d",
  measurementId: "G-WYL0JQ0TRD",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
//firebase.analytics();

export {
    storage,firebase
}