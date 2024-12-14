const SERVER = 'Server message'
module.exports = (io) => {
    io.on('connection', (socket)=>{
        console.log("user connected")
    
        socket.on("join room", async (data)=>{
            const { nickname , roomid} = data
            socket.join("room"+roomid)
    
            let __createdtime__ = Date.now()
            socket.to("room"+roomid).emit('server message', {
                msg: `${nickname} has joined the room`,
                nickname: SERVER,
                __createdtime__,
            })
            socket.emit('server message', {
                msg: `Welcome ${nickname}`,
                nickname: SERVER,
                __createdtime__,
            })
        })
    
        socket.on('server message', (data) => {
            const { nickname, roomid, msg} = data
            socket.in("room"+roomid).emit('server message', data)
        })

        socket.on('client message', (data) => {
            const { nickname, roomid, msg } = data
            socket.emit("save data", data)
            io.in("room" + roomid).emit('client message', data)
        })
        socket.on('disconnect', ()=>{
            console.log("user disconnected")
        })
    })
}



