const express = require("express")
const { createServer } = require("node:http")
const { Server } = require("socket.io")
const socketio = require("./socket")
const route = require("./authroutes")
const cookieparser = require("cookie-parser")

const app = express()
const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
        origin: 'http://localhost:3030',
        methods: ['GET', 'POST'],
    },
})

socketio(io)

app.use(express.json())
app.use(cookieparser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(route)
  
server.listen(3030, () => {
    console.log('server running at http://localhost:3030')
})