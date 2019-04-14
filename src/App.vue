<template>
    <div>
        <header class="table-control">
            <select class="side-select" v-model="playerSide">
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="watcher">Watcher</option>
            </select>
            <button type="button" class="restart-game" @click="restartGame">Restart</button>
            <button class="turn-around" type="button" @click="turnTableAround">Turn table around</button>
            <label class="disco-mode-label">Disco mode:
                <input v-model="discoMode" type="checkbox" class="disco-mode" style="vertical-align: middle"/>
            </label>
            <button type="button" @click="showMusic = true">Music player</button>
        </header>
        <div class="table-wrapper">
            <div class="table-chess-wrapper">
                <table-chess
                    :player-side="playerSide"
                ></table-chess>
            </div>
            <little-chat class="app-chat"
            ></little-chat>
        </div>
        <audio-player
            :isActive="showMusic"
            @close-music="showMusic = false"
            @get-media-elem="setSource($event)"
        ></audio-player>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Table from "./components/Table.vue";
import LittleChat from './components/LittleChat.vue';
import AudioPlayer from './components/AudioPlayer.vue';
import { setInterval } from 'timers';
import * as io from 'socket.io-client';

const socket = io();

export default Vue.extend({

    components: {
        'table-chess': Table,
        'little-chat': LittleChat,
        'audio-player': AudioPlayer
    },

    data() {
        return {
            isWhiteSideOnFront: true as boolean,
            playerSide: 'watcher' as string,
            discoMode: false as boolean,
            showMusic: false as boolean,
            audioSource: undefined as HTMLAudioElement | undefined,
            animationFrame: undefined as undefined | number,
            isAudioPlaying: false as boolean,
            amplitudeLimit: 28 as number,
        };
    },

    computed: {
        firstColor(): string | null {
            return getComputedStyle(document.querySelectorAll('.chess__square')[0]).backgroundColor;
        },

        secondColor(): string | null {
            return getComputedStyle(document.querySelectorAll('.chess__square')[1]).backgroundColor;
        },
    },
    
    watch: {
        discoMode(status: boolean): void {
            if (status) {
                this.startDisco();
            } else {
                this.setDefaultColors(<string>this.firstColor, <string>this.secondColor);
            }
        },

        isAudioPlaying(status: boolean) {
            if (status) {
                this.startAnimationFrame();
            } else {
                this.cancelAnimationFrame();
            }
        }
    },

    methods: {
        turnTableAround(): void {
            const chessTable: HTMLElement = <HTMLElement>document.querySelector('.chess-table');
            const allSquares: Array<HTMLElement> = Array.from(document.querySelectorAll('.chess__square')) as Array<HTMLElement>;

            if (this.isWhiteSideOnFront) {
                if (chessTable) chessTable.style.transform = 'rotate(180deg)';
                if (allSquares.length !== 0) Array.from(allSquares).forEach(element => {
                    element.style.transform = 'rotate(180deg)';
                });
                this.isWhiteSideOnFront = !this.isWhiteSideOnFront;
            } else {
                if (chessTable) chessTable.style.transform = 'rotate(0deg)';
                if (allSquares.length !== 0) allSquares.forEach(element => {
                    element.style.transform = 'rotate(0deg)';
                });
                this.isWhiteSideOnFront = !this.isWhiteSideOnFront;
            }
            
        },

        startDisco(): void {
            const allSquares: Array<HTMLElement> = Array.from(document.querySelectorAll('.chess__square'));
            const getRandom: (min: number, max: number) => number = function(min: number, max: number) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };

            let deg: number;

            allSquares.forEach(item => {
                deg = getRandom(0, 360);
                item.style.filter = `hue-rotate(${deg}deg)`;
            });

            socket.emit('disco-for-all', true);
        },

        setDefaultColors(firstColor: string, secondColor: string): void {
            const allSquares: Array<HTMLElement> = Array.from(document.querySelectorAll('.chess__square'));

            allSquares.forEach(item => {
                item.style.filter = 'hue-rotate(0deg)';
            });

            socket.emit('disco-for-all', false);
        },

        restartGame() {
            socket.emit('restartGame');
        },

        setSource(event) {
            this.audioSource = event;
        },

        startAnimationFrame() {
            // if (navigator.mediaDevices) {
            //     const stream = await navigator.mediaDevices.getUserMedia ({audio: true, video: false});
            //     (<HTMLAudioElement>this.audioSource).srcObject = stream;
            // }

            let currentAmp: number = 0;
            let prevAmp: number = 0;
            let resultAmp: number = 0;
            const audioCtx: AudioContext = new AudioContext();
            const analyser: AnalyserNode = audioCtx.createAnalyser();
            const audioStream: MediaStream = (<any>this.audioSource).captureStream();
            const source: MediaStreamAudioSourceNode = audioCtx.createMediaStreamSource(audioStream);
            source.connect(analyser);
            analyser.fftSize = 256;
            const bufferLegth: number = analyser.frequencyBinCount;
            const dataArray: Uint8Array = new Uint8Array(bufferLegth);

            const getFrequency = () => {
                this.animationFrame = window.requestAnimationFrame(getFrequency);

                analyser.getByteTimeDomainData(dataArray);
                
                currentAmp = dataArray[0];
                resultAmp = currentAmp - prevAmp;
                prevAmp = currentAmp;
                
                if (this.discoMode && Math.abs(resultAmp) > this.amplitudeLimit) this.startDisco();
            };

            getFrequency();
        },

        cancelAnimationFrame() {
            if (this.animationFrame) window.cancelAnimationFrame(this.animationFrame);
        }
    },

    mounted() {
        socket.emit('get-disco');
        (<HTMLAudioElement>this.audioSource).addEventListener('canplaythrough', () => socket.emit('get-music-playing'));

        socket.on('set-disco', (discoState: boolean) => {
            this.discoMode = discoState;
        });

        socket.on('play-music', () => {
            this.isAudioPlaying = true;
        });

        socket.on('pause-music', () => {
            this.isAudioPlaying = false;
        });
    }
})

const setChatHeight = function(): void {
    const littleChat = <HTMLElement>document.querySelector('.little-chat');
    const chatOut: HTMLElement = <HTMLElement>document.querySelector('.chat-out');
    
    if (window.innerWidth > 1000) {
        littleChat.style.height = '';
        chatOut.style.maxHeight = '';
        return;
    }

    const chessTable: HTMLElement = <HTMLElement>document.querySelector('.table-chess-wrapper');
    const chatIn: HTMLElement = <HTMLElement>document.querySelector('.chat-in');
    let chatHeight: number = document.body.offsetHeight - chessTable.getBoundingClientRect().bottom;
    littleChat.style.height = chatHeight + 'px';
    let maxHeight: number = chatIn.getBoundingClientRect().top - chessTable.getBoundingClientRect().bottom;
    chatOut.style.maxHeight = maxHeight + 'px';
};

window.addEventListener('load', () => {
    setTimeout(() => { setChatHeight() }, 20)}, false);

window.addEventListener('resize', () => {
    setTimeout(() => { setChatHeight() }, 20)}, false);

</script>
<style>
    html {
        font-size: 62.5%;
        height: 100vh;
        width: 100vw;
    }

    body {
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 0;
        height: 100vh;
        width: 100vw;
    }

    .table-wrapper {
        display: flex;
        justify-content: space-between;
        height: 100%;
    }

    @media screen and (max-width: 1000px) {
        .table-wrapper {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
        }
    }

    .table-control {
        padding: 10px 0;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .table-chess-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-basis: 75%;
        flex-grow: 1;
    }

    .disco-mode-label {
        font-size: 1.6rem;
        margin-top: 10px;
    }

    .app-chat {
        min-height: calc(100% - 40px);
        max-height: 580px;
        padding-right: 20px;

    }

    @media screen and (max-width: 1000px) {
        .app-chat {
            padding-right: 0;
        }
    }
</style>