const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/',(req,res)=>{
  res.send('hi')
})

io.on('connection',socket=>{
  console.log('user connected id:',socket.id)
  socket.on('sendMsg',data=>{
    io.emit('receiveMsg',data)
  })
  socket.on('add room',name=>{
    io.emit('new room',name)
  })

})

http.listen(4000, function(){
  console.log('listening on port:4000')
})