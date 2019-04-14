import { Http2Server } from "http2";
import { startingTable } from './src/components/startingTable';
import SquareInterface from "./src/Interfaces/SquareInterface";
import * as express from 'express';
import * as fs from 'fs';

const app: any = express();
const http: Http2Server = require('http').Server(app);
const io = require('socket.io')(http);

const serverAddress = 'http://localhost:3030';

let data: SquareInterface[] = startingTable;
let isWhiteTurn: boolean = true;

let music: File | null = null;
let musicName: string = '';
let musicPlaying: boolean = false;
let discoState: boolean = false;

app.use(express.static(__dirname + '/dist'));

io.on('connection', function(socket) {
  socket.emit('getData', {data: data, activeSide: isWhiteTurn});

  //получаем новую модель стола от клиента и обновляем у себя на сервере, потом отправляем на все сокеты (кроме того сокета откуда пришело событие) новую модель
  socket.on('postData', (newData: SquareInterface[]) => {
    data = newData;
    isWhiteTurn = !isWhiteTurn;
    socket.broadcast.emit('getData', {data: data, activeSide: isWhiteTurn});
  });

  //обновляем модель при повышении пешки по должности
  socket.on('promotion', (newData: SquareInterface[]) => {
    data = newData;
    socket.broadcast.emit('getData', {data: data, activeSide: isWhiteTurn});
  });

  //получаем от клиента новое сообщение и отправляем его по всем сокетам
  socket.on('newMessage', function(msg: string) {
    io.sockets.emit('addNewLine', msg);
  });

  //устанавливаем модель на сервере равной стартовому столу
  socket.on('restartGame', function() {
    data = startingTable;
    isWhiteTurn = true;
    io.sockets.emit('getData', {data: data, activeSide: isWhiteTurn});
  });

  //запрос от клиента для получения состояния диско мода
  socket.on('get-disco', () => {
    socket.emit('set-disco', discoState);
  });

  //принимаем от клиента новое состояние диско мода и отсылаем его всем
  socket.on('disco-for-all', (disco: boolean) => {
    discoState = disco;
    socket.broadcast.emit('set-disco', discoState);
  });

  //получаем от клиента выбранный файл. создаем или пересоздаем файл music.mp3. добавляем к пути файла time с текущим временем для перезаписи файла в теге audio на стороне всех клиентов
  socket.on('song-choosen', (data: {songFile: File, songName: string }) => {
    music = data.songFile;
    musicName = data.songName;
    fs.writeFile(`${__dirname}/dist/music.mp3`, music, err => {
      if (err) throw err;
    });
    const curDate = Date.now();
    io.sockets.emit('set-song', { songUrl: `${serverAddress}/music.mp3?time=${curDate}`, songName: musicName } as { songUrl: string, songName: string });
  });

  socket.on('get-song', () => {
    const curDate = Date.now();
    if (music) socket.emit('set-song', { songUrl: `${serverAddress}/music.mp3?time=${curDate}`, songName: musicName, isPlaying: musicPlaying } as { songUrl: string, songName: string, isPlaying: boolean });
  });

  socket.on('get-music-playing', () => {
    musicPlaying ? socket.emit('play-music') : socket.emit('pause-music');
  });

  socket.on('music-play', () => {
    musicPlaying = true;
    io.sockets.emit('play-music');
  });

  socket.on('music-pause', () => {
    musicPlaying = false;
    io.sockets.emit('pause-music');
  });

  socket.on('set-song-timer', (time: number) => {
    io.sockets.emit('song-timer-set', time);
  });
});

http.listen(3030, () => {
});