"use strict";
exports.__esModule = true;
var startingTable_1 = require("./src/components/startingTable");
var server_config_1 = require("./config/server.config");
var express = require("express");
var fs = require("fs");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serverAddress = server_config_1.serverConfig.prod;
var data = startingTable_1.startingTable;
var isWhiteTurn = true;
var music = null;
var musicName = '';
var musicPlaying = false;
var discoState = false;
app.use(express.static(__dirname + '/dist'));
io.on('connection', function (socket) {
    socket.emit('getData', { data: data, activeSide: isWhiteTurn });
    //получаем новую модель стола от клиента и обновляем у себя на сервере, потом отправляем на все сокеты (кроме того сокета откуда пришело событие) новую модель
    socket.on('postData', function (newData) {
        data = newData;
        isWhiteTurn = !isWhiteTurn;
        socket.broadcast.emit('getData', { data: data, activeSide: isWhiteTurn });
    });
    //обновляем модель при повышении пешки по должности
    socket.on('promotion', function (newData) {
        data = newData;
        socket.broadcast.emit('getData', { data: data, activeSide: isWhiteTurn });
    });
    //получаем от клиента новое сообщение и отправляем его по всем сокетам
    socket.on('newMessage', function (msg) {
        io.sockets.emit('addNewLine', msg);
    });
    //устанавливаем модель на сервере равной стартовому столу
    socket.on('restartGame', function () {
        data = startingTable_1.startingTable;
        isWhiteTurn = true;
        io.sockets.emit('getData', { data: data, activeSide: isWhiteTurn });
    });
    //запрос от клиента для получения состояния диско мода
    socket.on('get-disco', function () {
        socket.emit('set-disco', discoState);
    });
    //принимаем от клиента новое состояние диско мода и отсылаем его всем
    socket.on('disco-for-all', function (disco) {
        discoState = disco;
        socket.broadcast.emit('set-disco', discoState);
    });
    //получаем от клиента выбранный файл. создаем или пересоздаем файл music.mp3. добавляем к пути файла time с текущим временем для перезаписи файла в теге audio на стороне всех клиентов
    socket.on('song-choosen', function (data) {
        music = data.songFile;
        musicName = data.songName;
        fs.writeFile(__dirname + "/dist/music.mp3", music, function (err) {
            if (err)
                throw err;
        });
        var curDate = Date.now();
        io.sockets.emit('set-song', { songUrl: serverAddress + "/music.mp3?time=" + curDate, songName: musicName });
    });
    socket.on('get-song', function () {
        var curDate = Date.now();
        if (music)
            socket.emit('set-song', { songUrl: serverAddress + "/music.mp3?time=" + curDate, songName: musicName, isPlaying: musicPlaying });
    });
    socket.on('get-music-playing', function () {
        musicPlaying ? socket.emit('play-music') : socket.emit('pause-music');
    });
    socket.on('music-play', function () {
        musicPlaying = true;
        io.sockets.emit('play-music');
    });
    socket.on('music-pause', function () {
        musicPlaying = false;
        io.sockets.emit('pause-music');
    });
    socket.on('set-song-timer', function (time) {
        io.sockets.emit('song-timer-set', time);
    });
});
http.listen(3030, function () {
});
