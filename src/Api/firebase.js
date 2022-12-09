import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyD5lilvBn5oEii04OMLHzThddGA2OLgYUE",
    authDomain: "wakanim-43128.firebaseapp.com",
    projectId: "wakanim-43128",
    storageBucket: "wakanim-43128.appspot.com",
    messagingSenderId: "999339145926",
    appId: "1:999339145926:web:7564aad15a1f494003b5c7",
    measurementId: "G-04EPDP169M"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export {app, storage}
