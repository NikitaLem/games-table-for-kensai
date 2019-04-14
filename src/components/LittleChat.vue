<template>
    <div class="little-chat">
        <ul class="chat-out" id="chat-out">
            <li v-for="(msg, index) in allMessages" :key="index" @load="scrollDown">
                <span>{{ `>>№${index} ${newMessageDate}` }}</span><br/>
                <span>{{ `${msg}` }}</span>
            </li>
        </ul>
        <form action="" @submit="sendMessage($event)">
            <div class="chat-in">
                <input  id="message" autocomplete="off" style="flex-grow: 1; padding-left: 15px; font-size: 2rem;" v-model="currentMessage"/>
                <input type="submit" value="Send"/>
            </div>
        </form>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import * as io from 'socket.io-client';
import { setTimeout } from 'timers';

const socket = io();

export default Vue.extend({
    name: 'LittleChat',

    data() {
        return {
            currentMessage: '' as string,
            allMessages: [] as string[],
        };
    },

    computed: {
        newMessageDate() {
            const date: Date = new Date();
            let month: string;
            let day: string;
            let hours: string;
            let minutes: string;
            date.getMonth() - 9 >= 0 ? month = `${date.getMonth() + 1}` : month = `0${date.getMonth() + 1}`; 
            date.getDate() - 10 >= 0 ? day = `${date.getDate()}` : day = `0${date.getDate()}`;
            date.getHours() - 10 >= 0 ? hours = `${date.getHours()}` : hours = `0${date.getHours()}`;
            date.getMinutes() - 10 >= 0 ? minutes = `${date.getMinutes()}` : minutes = `0${date.getMinutes()}`;
            return `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}`;
        },
    },

    methods: {
        sendMessage(event: any): void {
            if (this.currentMessage === '') {
                event.preventDefault();
                return;
            }
            socket.emit('newMessage', this.currentMessage);
            this.currentMessage = '';
            event.preventDefault();
        },

        scrollDown(): void {
            
        }
    },

    mounted() {
        socket.on('addNewLine', (msg: string) => {
            this.allMessages.push(msg);
            const chatOut: HTMLElement | null = document.querySelector('.chat-out');
            if (chatOut) setTimeout(()=> {chatOut.scrollTop = chatOut.scrollHeight}, 50);
        });
    }
    
})
</script>
<style>
    .little-chat {
        width: 100%;
    }

    .chat-out {
        background-color: #ffffff;
        box-sizing: border-box;
        border: 2px solid #444444;
        width: 100%;
        height: calc(100% - 40px);
        margin: 0;
        padding: 0;
        list-style: none;
        overflow-y: scroll;
        word-break: break-all;
    }

    .chat-out li {
        font-size: 1.6rem;
        padding: 5px 0 5px 15px;
        margin: 2px 0;
        background-color: #F0E0D6;
        color: #800000;
    }

    .chat-in {
        display: flex;
        width: 100%;
        height: 40px;
        border: 1px solid #444444;
        box-sizing: border-box;
    }
</style>
