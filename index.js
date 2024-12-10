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

    socket.on("join room", (roomid)=>{
        socket.join("room"+roomid)
        console.log(io.sockets.adapter.rooms)
    })
    
    socket.on('chat message', ({msg, nickname, roomid}) => {
        //io.to("room"+roomid).emit('send message', {msg, nickname, roomid})
        io.to("room"+roomid).emit('send message', {msg, nickname, roomid})
        console.log(socket.id,'room'+roomid, nickname, msg)
    })

    socket.on('disconnect', ()=>{
        console.log("user disconnected")
    })

    socket.onAny((event, ...args) => {
        console.log(event, args);
      });
})
  
server.listen(3030, () => {
    console.log('server running at http://localhost:3030')
})