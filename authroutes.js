const express = require('express')
const bcrypt = require('bcryptjs')
const { join } = require("node:path")
const db = require('./database')
const jwt = require('jsonwebtoken')
const mw = require('./middleware')
const router = express.Router()

function validE(e) {
    const patt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return patt.test(e);
}

router.get('/chatroom/:id', mw.authenticationProcess, (req, res) => {
    res.sendFile(join(__dirname, 'templates/chatroom.html'))
})

router.get("/chatrooms", mw.authenticationProcess, (req, res)=>{
    const datab = db.getConnection()
    datab.query("SELECT * FROM chatroom", (e, result)=>{
        if (e){
            return res.status(500).json({ error: "error getting chatrooms"})
        }
        res.json(result)
    })
})

router.get("/users", mw.authenticationProcess, mw.authenticateAdmin, (req, res)=>{
    const datab = db.getConnection()
    datab.query("SELECT * FROM user", (e, result)=>{
        if(e){
            console.log("error getting users", e)
        }
        res.json(result)
    })
})

router.post("/createroom", mw.authenticationProcess, mw.authenticateAdmin, (req, res)=>{
    const { name } = req.body
    const datab = db.getConnection()

    datab.query("INSERT INTO chatroom (name) VALUES (?)", [name], (e, result)=>{
        if(e){
            return res.status(500).json({ error: "error creating room"})
        }
        return res.status(200).json({ message: "chatroom created", id: result.insertId, name})
    })
})


router.delete("/deleteroom/:id", mw.authenticationProcess ,mw.authenticateAdmin, (req, res)=>{
    const roomid = req.params.id
    const datab = db.getConnection()

    datab.query("DELETE FROM chatroom WHERE id = ?", [roomid], (e, result)=>{
        if (e){
            return res.status(500).json({ error: "error deleting room"})
        }

        return res.status(200).json({ message: 'chatroom deleted'})
    })
})

router.get('/chatrooms-page', mw.authenticationProcess, (req, res) => {
    res.sendFile(join(__dirname, 'templates/chatrooms.html'))
})

router.get('/register', (req, res) => {
    res.sendFile(join(__dirname, 'templates/register.html'))
})

router.get('/admin', mw.authenticationProcess ,mw.authenticateAdmin, (req, res)=>{
    res.sendFile(join(__dirname, "templates/adminpanel.html"))
})

router.post('/register', (req,res)=>{
    const { email, password } = req.body
    if(!validE(email)){
        return res.status(400).send("incorrect email")
    }
    
    const hashPassword = bcrypt.hashSync(password, 10)

    const datab = db.getConnection()
    datab.query("INSERT INTO user (email, password) values (?,?)", [email, hashPassword], (e,result)=>{
        if (e){
            return res.status(500).json({ error: "error registering account"})
        }else{
            return res.status(200).send("user registered")
        }
        datab.end()
    })
})

router.post('/login',(req,res)=>{
    const { email, password} = req.body

    const datab = db.getConnection()
    datab.query("SELECT * FROM user where email = ?",[email], (e, result)=>{
        if (e){
            return res.status(500).json({ error: "error logging in account"})
        } else {
            const user = result[0]
            if(!user){
                return res.status(400).send("no logins")
            }
            console.log(user)
            if(!user && !bcrypt.compare(password, user.password)){
                return res.status(401).send("not valid")
            }

            const token =jwt.sign(
                { email: user.email, id: user.id, role: user.role},
                process.env.SECRET_JWT_APP,
                { algorithm: 'HS256', expiresIn: '24h'}
            )

            datab.end()

            res.cookie('authToken', token, {httpOnly:true, secure: true, maxAge: 86400000})
            return res.status(200).send("logged in")
        }
    })
})

router.get('/login', (req, res) => {
    res.sendFile(join(__dirname, 'templates/login.html'))
})

module.exports = router
