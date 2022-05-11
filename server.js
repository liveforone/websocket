// <server.js> //
//==dependencies==//
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


//==routing==//
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html');
});


//==socket==//
let count = 1;
io.on('connection', (socket) => {
    /*
    해당 이벤트인 connection에 관련한 이벤트들은
    반드시 'connection' event listener 안에 작성되야함
    */
    console.log('user connected: ', socket.id);
    let name = 'user' + count++;
    io.to(socket.id).emit('change name', name);
    //emit : 클라이언트에서 socket을 통해 event를 서버로 전달

    socket.on('disconnect', () => {
        console.log('user disconnected: ', socket.id);
    });

    socket.on('send message', (name, text) => {
        let msg = name + ' : ' + text;
        console.log(msg);
        io.emit('receive message', msg);
    });
});

http.listen(3000, () => {
    console.log('server on!!');
});