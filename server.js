import express from "express";
import bcrypt from "bcrypt";
import stripe from "stripe";
import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"

//configuracion de firebase
const firebaseConfig = {
        apiKey: "AIzaSyAQHzhSxQaMCOFnfFoZqxS1ALpYSfAh2R0",
        authDomain: "ecommercerce.firebaseapp.com",
        projectId: "ecommercerce",
        storageBucket: "ecommercerce.appspot.com",
        messagingSenderId: "155309159798",
        appId: "1:155309159798:web:ab422db099bfe04c657657"

}
const firebase = initializeApp(firebaseConfig)
const db = getFirestore()

//inicializacion del servidor 
const app = express()

//middleware
app.use(express.static('public'))
app.use(express.json())//permite compartir forms

//rutas 
    //ruta home
app.get('/', (req, res) =>{
    res.sendFile('index.html', {root: 'public'})
})

app.listen(3000, () => {
    console.log('Servidor en linea...')
})