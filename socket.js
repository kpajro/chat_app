const SERVER = 'Server message'
module.exports = (io) => {
    io.on('connection', (socket)=>{
        console.log("user connected")
    
        socket.on("join room", (data)=>{
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
            const { nickname, roomid, msg, __createdtime__ } = data
            io.in("room"+roomid).emit('server message', data)
            //console.log('room'+roomid, nickname, msg, socket.id)
        })

        socket.on('client message', (data) => {
            const { nickname, roomid, msg, __createdtime__ } = data
            io.in("room"+roomid).emit('client message', data)
            //console.log(socket.id)
            //console.log('room'+roomid, nickname, msg, socket.id)
        })
        
    
        socket.on('disconnect', ()=>{
            console.log("user disconnected")
        })
    })
}



