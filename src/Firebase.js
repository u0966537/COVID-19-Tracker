import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAOe4eynhgx2cNrLFCoHhQbwONc8XSm-ME",
  authDomain: "covid-19-tracker-he.firebaseapp.com",
  databaseURL: "https://covid-19-tracker-he.firebaseio.com",
  projectId: "covid-19-tracker-he",
  storageBucket: "covid-19-tracker-he.appspot.com",
  messagingSenderId: "329690731591",
  appId: "1:329690731591:web:c4d64645f2c654c6cd8d62",
  measurementId: "G-CGYBZBTR5S"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export default db;