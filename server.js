// <server.js> //
/*
1. 접속자 1이 메세지를 전송하면 브라우저에서 'send message' 
event를 메세지와 함께 서버로 전달함
2. 서버에서 'send message' event listener에서 
event를 감지하고 메세지를 전달받음
3. 서버의 'send message' event listener가 'receive message' 
event를 메세지와 함께 접속중인 모든 클라이언트에게 보냄
4. 접속중인 모든 클라이언트의 'receive message' 
event listener가 event를 감지하고 메세지를 전달받음
5. 클라이언트들의 'receive message' event listener가 
메세지를 화면에 표시함
*/
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