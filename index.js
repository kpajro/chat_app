const express = require("express")
const { createServer } = require("node:http")
const { Server } = require("socket.io")
const route = require("./authroutes")
const cookieparser = require("cookie-parser")

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.json())
app.use(cookieparser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(route)

io.on('connection', (socket)=>{
    console.log("user connected")

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    })

    socket.on("join room", (roomid)=>{
        socket.join(roomid)
        io.to(`${roomid}`).emit("user joined the room", "aaa")
    })

    socket.on('disconnect', ()=>{
        console.log("user disconnected")
    })
})
  
server.listen(3030, () => {
    console.log('server running at http://localhost:3030')
})