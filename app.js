const express = require("express")
const session = require("express-session")
const employerRouter = require("./router/employerRouter")
const entrepriseRouter=require("./router/entrepriseRouter")
const ordinateurRouteur=require("./router/ordinateurRouter")
const taskRouter = require("./router/taskRouter")


const app = express()
app.use(express.static("./public"))
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret : 'ffdsgsf;hhstqer:tre876788775fsdfdsgdg',
    resave: true,
    saveUninitialized : true,
}));

  
 

app.use(employerRouter)
app.use(entrepriseRouter)
app.use(ordinateurRouteur)
app.use(taskRouter)


app.listen(3000,()=>{ 
    console.log("ecoute sur le port 3000");
    
})     