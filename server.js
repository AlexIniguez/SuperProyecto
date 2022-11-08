import express from "express";
import bcrypt from "bcrypt";
import stripe from "stripe";
import {initializeApp} from "firebase/app"
import {collection, doc, getDoc, getFirestore, setDoc} from "firebase/firestore"

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

//ruta para registrar
app.get('/signup', (req, res) => {
    res.sendFile('signup.html', {root: 'public'})
})

//ruta para login
app.get('/login', (req, res) => {
    res.sendFile('login.html', {root: 'public'})
})

app.post('/signup', (req, res) =>{
    const { name, email, password, number, tac} = req.body
    //validaciones
    if(name.length < 3){
        res.json({'alert':'name must be 3 character long'})
    }else if (!email.length){
        res.json({'alert':'enter your email'})
    }else if (password.length < 8) {
        res.json({'alert':'password must be 8 letters long'})
    }else if (!Number(number) || number.length <10){
        res.json({'alert':'invalid number, please enter a valid one'})
    }else if(!tac) {
        res.json({'alert':'you must agree to our terms'})
    }else {
        //almacenar datos de db
        const users = collection(db, "users")
        getDoc(doc(users, email)).then(user => {
            if(user.exists()){
                res.json({'alert':'email already exists'})
            }else{
                //encriptar password
                bcrypt.genSalt(10, (err, hash)=> {
                    bcrypt.hash(password, salt,(err, hash) => {
                        req.body.password = hash
                        req.body.seller = false
                        setDoc(doc(users, email), req.body).then(data =>{
                        res.json({
                            name: req.body.name,
                            email: req.body.email,
                            seller: req.body.seller
                        })
                    })
                })
                    })
            }
        })
    }
})

app.post('/login', (req, res) =>{
    let { email, password} = req.body
    console.log(email, password)
    if( !email.length || !password.length){
        return res.json({
            'alert': 'fill all the inputs'
        })
    }
    const users = collection(db, 'users')
    getDoc(doc(users, email))
        .then( user => {
            if(!user.exists()){
                return res.json({
                    'alert': 'mail doesnt exists' 
                })
            }else{
                console.log('bd', user.data().password)
                bcrypt.compare(password, user.data().password, (err, result) =>{
                    if(result){
                        let data = user.data()
                        return res.json({
                            name: data.name,
                            email: data.email,
                            seller: data.seller
                        })
                    }else{
                        return res.json({'alert': 'pasword is incorrect'})
                    }
                })
            }
        })
})

app.listen(3000, () => {
    console.log('Servidor en linea...')
})