<style>
  .audio-wrapper {
    z-index: 2000;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.75);
  }

  .audio-wrapper > section {
    background-color: rgba(23, 23, 23, 0.8);
    border: 2px solid #767676;
    border-radius: .8rem;
    padding: 1.5rem;
  }

  .chess-song-picker {
    border-radius: .4rem;
    background-color: #030175;
    color: #ffffff;
    font-size: 1.4rem;
    padding: .5rem .8rem;
    cursor: pointer;
  }

  .chess-song-picker:hover {
    background-color: #010042;
  }

  #chess-music {
    display: none;
  }

  .audio-controlls {
    display: flex;
    align-items: center;
  }

  .audio-button {
    background-color: #030175;
    color: #ffffff;
    font-size: 1.4rem;
    padding: .5rem .8rem;
    cursor: pointer;
  }

  .audio-button:hover {
    background-color: #010042;
  }

  .audio-bottom {
    display: flex;
    justify-content: flex-end;
  }

  .song-name {
    color: #ffffff;
    font-size: 1.2rem;
  }

  .audio-timeline {
    flex-grow: 1;
    height: 2.6rem;
  }

  .audio-timeline input {
    -webkit-appearance: none;
    width: 100%;
    height: 2.6rem;   
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    margin: 0;
  }

  .audio-timeline input::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 2.6rem;
    height: 2.6rem;
    background: #030175;
    cursor: pointer;
  }

  .audio-timeline input::-webkit-slider-thumb:hover {
    background: #010042;
  }

  .audio-timeline input::-moz-range-thumb {
    width: 2.6rem;
    height: 2.6rem;
    background: #030175;
    cursor: pointer;
  }

  .audio-timer {
    color: #ffffff;
    font-size: 2.1rem;
  }

  .audio-volume {
    -webkit-appearance: none;
    width: 30%;
    height: 0.6rem;   
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    margin: 0;
  }

  .audio-volume::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 2.6rem;
    height: 0.6rem;
    background: #030175;
    cursor: pointer;
  }
</style>

<template>
<div v-show="isActive" class="audio-wrapper" @click.self="closeMusic">
  <section>
    <div style="display: flex; flex-direction: column;">
      <audio id="chess-audio-player" :src="audioSrc" loop></audio>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div v-if="audioSrc" class="audio-timer">{{ audioTimer }}</div>
        <input v-show="audioSrc" type="range" class="audio-volume" min="0" max="1" step="0.01" v-model="audioVolume"
          @input="setAudioVolume($event)"
        >
      </div>
      <div class="audio-controlls" v-if="audioSrc !== ''">
        <span class="audio-button" @click="togglePlay()">
          <i v-if="!audioPlayed" class="fas fa-play"></i>
          <i v-else class="fas fa-pause"></i>
        </span>
        <span class="audio-timeline">
          <input type="range" step="1" min="0" :max="songDuration" v-model="songCurrentTime" 
           @click="setAudioTime($event)"
           @mouseleave="canUpdateTime = true"
           @mousemove="canUpdateTime = false"
          >
        </span>
        <a class="audio-button" :href="audioSrc" :download="audioName">
          <i class="fas fa-file-download"></i>
        </a>
      </div>
      <p class="song-name">{{ audioName !== '' ? audioName : 'Audio not chose' }}</p>
      <div class="audio-bottom">
        <label class="chess-song-picker" for="chess-music">Choose audio file</label>
        <input id="chess-music" type="file" accept="audio/*" @input="chooseSong()">
      </div>
    </div>
  </section>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as io from 'socket.io-client';
import { setTimeout } from 'timers';

const socket = io();

export default Vue.extend({
  name: 'AudioPlayer',

  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      audioEl: null as HTMLAudioElement | null,
      audioSrc: '' as string,
      audioPlayed: false as boolean,
      audioName: '' as string,
      songDuration: 0 as number,
      songCurrentTime: 0 as number,
      canUpdateTime: true as boolean,
      audioVolume: '1' as string,
    };
  },

  watch: {
    audioEl() {
      if (this.audioEl) this.$emit('get-media-elem', this.audioEl);
    }
  },

  computed: {
    audioTimer(): string | undefined {
      if (this.songDuration) {
        let fullTime = Math.round(this.songDuration);
        let currentTime = Math.round(this.songCurrentTime);
        return `${this.formatSeconds(currentTime)}/${this.formatSeconds(fullTime)}`;
      }
    }
  },

  methods: {
    chooseSong() {
      const songPicker: HTMLInputElement = <HTMLInputElement>document.getElementById('chess-music');
      const song: File = (<FileList>songPicker.files)[0];

      socket.emit('song-choosen', { songFile: song, songName: (<File>song).name } as { songFile: File, songName: string});
    },

    closeMusic() {
      this.$emit('close-music');
    },

    togglePlay() {
      this.audioPlayed ? socket.emit('music-pause') : socket.emit('music-play');
    },

    setAudioTime(event) {
      socket.emit('set-song-timer', this.songCurrentTime);
    },

    setSongDuration() {
      if (this.audioSrc) {
        this.songDuration = (<HTMLAudioElement>this.audioEl).duration;
      } else {
        this.songDuration = 0;
      }
    },

    startPlayer(player: HTMLAudioElement) {
      (<HTMLAudioElement>this.audioEl).play();
      this.audioPlayed = true;
    },

    pausePlayer(player: HTMLAudioElement) {
      (<HTMLAudioElement>this.audioEl).pause();
      this.audioPlayed = false;
    },

    updatePlayerTrack(player: HTMLAudioElement) {
      if (!this.canUpdateTime) return;
      this.songCurrentTime = player.currentTime;
    },

    formatSeconds(secs: number): string {
      let minutes: string = Math.floor(secs / 60).toString(10);
      let seconds: string = (secs - Number.parseInt(minutes) * 60).toString(10);
      if (Number.parseInt(minutes) < 10) minutes = `0${minutes}`;
      if (Number.parseInt(seconds) < 10) seconds = `0${seconds}`;
      return `${minutes}:${seconds}`;
    },

    setAudioVolume(event) {
      if (!this.audioEl) return;

      const target = event.target.closest('.audio-volume');
      
      this.audioEl.volume = Number.parseFloat(this.audioVolume);
      target.style.background = `linear-gradient(to right, #3F32BD 0%, #3F32BD ${Number.parseFloat(this.audioVolume) * 100}%, #d3d3d3 ${Number.parseFloat(this.audioVolume) * 100}%, #d3d3d3 100%)`;
    },
  },

  mounted() {
    this.audioEl = <HTMLAudioElement>document.getElementById('chess-audio-player');

    this.setSongDuration();
    if (this.audioEl) this.$emit('get-media-elem', this.audioEl);

    //при открытии страницы отправляем запрос на получение загруженной на сервер песни
    socket.emit('get-song');

    //устанавливаем путь к файлу на сервере в тэг audio. по загрузке файла в audio обновляем duration
    socket.on('set-song', (data) => {
      if (data !== undefined) {
        this.audioSrc = data.songUrl;
        this.audioName = data.songName;
        (<HTMLAudioElement>this.audioEl).addEventListener('durationchange', () => {
          this.setSongDuration();
          data.isPlaying ? this.startPlayer(this.audioEl as HTMLAudioElement) : this.pausePlayer(this.audioEl as HTMLAudioElement);

          (<HTMLAudioElement>this.audioEl).addEventListener('timeupdate', () => { this.updatePlayerTrack(this.audioEl as HTMLAudioElement); }, false);
        }, false);
      }
    });

    socket.on('play-music', () => {
      this.startPlayer(this.audioEl as HTMLAudioElement);
    });

    socket.on('pause-music', () => {
      this.pausePlayer(this.audioEl as HTMLAudioElement);
    });

    //устанавливаем таймер текущей песни при запросе от сервера
    socket.on('song-timer-set', (timer: number) => {
      (<HTMLAudioElement>this.audioEl).currentTime = timer;
      this.canUpdateTime = true;
    });

    (<HTMLElement>document.querySelector('.audio-volume')).style.background = `linear-gradient(to right, #3F32BD 0%, #3F32BD ${Number.parseFloat(this.audioVolume) * 100}%, #d3d3d3 ${Number.parseFloat(this.audioVolume) * 100}%, #d3d3d3 100%)`;
  }
})
</script>
