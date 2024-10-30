import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDw20cvVatSQlqN6JBAa5Ye0ilkCvGlCAE",
  projectId: "10163179950",
  authDomain: "synergox.firebaseapp.com",
  databaseURL: "https://synergox-default-rtdb.firebaseio.com",
  storageBucket: "synergox.appspot.com",
  messagingSenderId: "112694691692601661187",
  appId: "1:112694691692601661187:web:0aec606e8a44c586ff8fd8"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
