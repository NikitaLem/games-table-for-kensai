<template>
    <div class="chess-table">
        <div class="super-pawn-menu super-pawn-menu_white" v-if="whitePawnPromotion">
            <square :state="3" :background-color="`#cf7249`" 
                :playable-square="false"
                @figure-picker="completePawnPropogation($event)"
            ></square>
            <square :state="4" :background-color="`#cf7249`"
                :playable-square="false"
                @figure-picker="completePawnPropogation($event)"
            ></square>
            <square :state="5" :background-color="`#cf7249`" 
                :playable-square="false"
                @figure-picker="completePawnPropogation($event)"
            ></square>
            <square :state="6" :background-color="`#cf7249`" 
                :playable-square="false"
                @figure-picker="completePawnPropogation($event)"
            ></square>
        </div>
        <div class="super-pawn-menu super-pawn-menu_black" v-if="blackPawnPromotion">
            <square :state="-3" :background-color="`#ffeece`"
                :playable-square="false"
                @figure-picker="completePawnPropogation($event)"
            ></square>
            <square :state="-4" :background-color="`#ffeece`"
                :playable-square="false"
                @figure-picker="completePawnPropogation($event)"
            ></square>
            <square :state="-5" :background-color="`#ffeece`"
                :playable-square="false"
                @figure-picker="completePawnPropogation($event)"
            ></square>
            <square :state="-6" :background-color="`#ffeece`"
                :playable-square="false"
                @figure-picker="completePawnPropogation($event)"
            ></square>
        </div>
        <div class="play-stoper" v-if="whitePawnPromotion || blackPawnPromotion"></div>
        <square v-for="(item, index) in chessFieldModel" :key="index"
            :number-of-field="index"
            :background-color="item.squareColor"
            :state="item.figure"
            :possible-turn="item.possibleTurn"
            :is-active="item.isActive"
            :is-white-turn="isWhiteTurn"
            :player-side="playerSide"
            @figure-touched="prepareToTurn($event)"
            @figure-turned="endOfTurn($event)"
        ></square>
        <div class="letters">
            <span class="letter">A</span>
            <span class="letter">B</span>
            <span class="letter">C</span>
            <span class="letter">D</span>
            <span class="letter">E</span>
            <span class="letter">F</span>
            <span class="letter">G</span>
            <span class="letter">H</span>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Square from "./Square.vue";
import SquareInterface from '../Interfaces/SquareInterface';
import PawnApi from '../FiguresApi/Pawn';
import KnightApi from '../FiguresApi/Knight';
import BishopApi from '../FiguresApi/Bishop';
import RockApi from '../FiguresApi/Rock';
import QueenApi from '../FiguresApi/Queen';
import KingApi from '../FiguresApi/King';
import * as io from 'socket.io-client';

const socket = io();

export default Vue.extend({
    name: 'Table',
    components: {
        'square': Square,
    },

    props: {
        playerSide: {
            type: String,
            default: 'watcher',
        },
    },

    data() {
        return {
            chessFieldModel: [] as SquareInterface[],
            isFigureActive: false as boolean,
            activeFigure: null as number | null | undefined,
            activeSquare: null as number | null,
            possibleTurnes: [] as number[],

            isWhiteTurn: true as boolean,

            allFieldsUnderWhiteAttack: [] as number[],
            allFieldsUnderBlackAttack: [] as number[],

            pawnForPromotionPosition: null as number | null,

            castling: {
                isWhiteShortCastlingEverPossible: true as boolean,
                isWhiteLongCastlingEverPossible: true as boolean,
                isBlackShortCastlingEverPossible: true as boolean,
                isBlackLongCastlingEverPossible: true as boolean,
            },
        };
    },

    computed: {
        whiteUnderCheck(): boolean {
            if (this.chessFieldModel.length > 0) {
                const whiteKingPosition = this.chessFieldModel.findIndex(item => item.figure === 2);
                
                if (this.allFieldsUnderBlackAttack.indexOf(whiteKingPosition) !== -1) return true;
                return false;
            }

            return false
        },

        blackUnderCheck(): boolean {
            if (this.chessFieldModel.length > 0) {
                const blackKingPosition = this.chessFieldModel.findIndex(item => item.figure === -2);
                
                if (this.allFieldsUnderWhiteAttack.indexOf(blackKingPosition) !== -1) return true;
                return false;
            }

            return false;
        },

        whitePawnPromotion(): boolean {
            if (this.chessFieldModel.length > 0) {
                for (let i = 0; i < 8; i += 1) {
                    if (this.chessFieldModel[i].figure === 1) {
                        this.pawnForPromotionPosition = i;
                        return true;
                    }
                }

                this.pawnForPromotionPosition = null;
                return false;
            }

            return false;
        },

        blackPawnPromotion(): boolean {
            if (this.chessFieldModel.length > 0) {
                for (let i = 56; i < 64; i += 1) {
                    if (this.chessFieldModel[i].figure === -1) {
                        this.pawnForPromotionPosition = i;
                        return true;
                    }
                }

                this.pawnForPromotionPosition = null;
                return false;
            }

            return false;
        },

        whiteShortCastling(): boolean {
            if (this.chessFieldModel.length > 0) {
                if (this.castling.isWhiteShortCastlingEverPossible)
                    if (this.allFieldsUnderBlackAttack.indexOf(61) === -1 && 
                        this.allFieldsUnderBlackAttack.indexOf(62) === -1 &&
                        this.chessFieldModel[61].figure === 0 &&
                        this.chessFieldModel[62].figure === 0) return true;

                return false;
            }

            return false;
        },

        blackShortCastling(): boolean {
            if (this.chessFieldModel.length > 0) {
                if (this.castling.isBlackShortCastlingEverPossible)
                    if (this.allFieldsUnderWhiteAttack.indexOf(5) === -1 && 
                        this.allFieldsUnderWhiteAttack.indexOf(6) === -1 &&
                        this.chessFieldModel[5].figure === 0 &&
                        this.chessFieldModel[6].figure === 0) return true;

                return false;
            }
            return false;
        },

        whiteLongCastling(): boolean {
            if (this.chessFieldModel.length > 0) {
                if (this.castling.isWhiteLongCastlingEverPossible)
                    if (this.allFieldsUnderBlackAttack.indexOf(57) === -1 && 
                        this.allFieldsUnderBlackAttack.indexOf(58) === -1 &&
                        this.allFieldsUnderBlackAttack.indexOf(59) === -1 &&
                        this.chessFieldModel[57].figure === 0 &&
                        this.chessFieldModel[58].figure === 0 &&
                        this.chessFieldModel[59].figure === 0) return true;

                return false;
            }
            return false;
        },

        blackLongCastling(): boolean {
            if (this.chessFieldModel.length > 0) {
                if (this.castling.isBlackLongCastlingEverPossible)
                    if (this.allFieldsUnderWhiteAttack.indexOf(1) === -1 && 
                        this.allFieldsUnderWhiteAttack.indexOf(2) === -1 &&
                        this.allFieldsUnderWhiteAttack.indexOf(3) === -1 &&
                        this.chessFieldModel[1].figure === 0 &&
                        this.chessFieldModel[2].figure === 0 &&
                        this.chessFieldModel[3].figure === 0) return true;

                return false;
            }
            return false;
        },
    },

    methods: {
        //смотрим что за фигура, готовим возможные клетки для хода фигуры с её текущей позиции
        prepareToTurn(event: number): void {
            if (this.activeSquare === event) {
                this.clearTableAfterTurn();
                return;
            }

            if (!this.isFigureActive) {
                this.activeSquare = event;
                this.activeFigure = this.chessFieldModel[this.activeSquare].figure;
                this.chessFieldModel[this.activeSquare].isActive = true;

                this.possibleTurnes.splice(0, this.possibleTurnes.length);

                switch (this.activeFigure) {
                    case -1: case 1: 
                        this.possibleTurnes = PawnApi.calcPossibleTurns(this.chessFieldModel, this.activeFigure, this.activeSquare);
                        break;
                    case -2:
                        this.possibleTurnes = KingApi.calcPossibleTurns(this.chessFieldModel, this.activeFigure, this.activeSquare, this.blackShortCastling, this.blackLongCastling);
                        break;
                    case 2: 
                        this.possibleTurnes = KingApi.calcPossibleTurns(this.chessFieldModel, this.activeFigure, this.activeSquare, this.whiteShortCastling, this.whiteLongCastling);
                        break;
                    case -3: case 3:
                        this.possibleTurnes = QueenApi.calcPossibleTurns(this.chessFieldModel, this.activeFigure, this.activeSquare);
                        break;
                    case -4: case 4:
                        this.possibleTurnes = BishopApi.calcPossibleTurns(this.chessFieldModel, this.activeFigure, this.activeSquare);
                        break;
                    case - 5: case 5:
                        this.possibleTurnes = KnightApi.calcPossibleTurns(this.chessFieldModel, this.activeFigure, this.activeSquare);
                        break;
                    case - 6: case 6:
                        this.possibleTurnes = RockApi.calcPossibleTurns(this.chessFieldModel, this.activeFigure, this.activeSquare);
                        break;
                    default: break;
                }

                this.possibleTurnes.length !== 0 ? this.isFigureActive = true : this.clearTableAfterTurn();

                this.chessFieldModel.forEach((item, index) => {
                    if (this.possibleTurnes.indexOf(index) !== -1) item.possibleTurn = true;
                });
            }
        },

        endOfTurn(event: number): void {
            if (this.activeFigure === 2 && event === 62) {
                this.chessFieldModel[63].figure = 0;
                this.chessFieldModel[61].figure = 6;
            }

            if (this.activeFigure === 2 && event === 57) {
                this.chessFieldModel[56].figure = 0;
                this.chessFieldModel[58].figure = 6;
            }

            if (this.activeFigure === -2 && event === 6) {
                this.chessFieldModel[7].figure = 0;
                this.chessFieldModel[5].figure = -6;
            }

            if (this.activeFigure === -2 && event === 1) {
                this.chessFieldModel[0].figure = 0;
                this.chessFieldModel[2].figure = -6;
            }

            const figureAtPoint: number | null | undefined = this.chessFieldModel[event].figure;

            this.chessFieldModel[this.activeSquare as number].figure = 0;
            this.chessFieldModel[event].figure = this.activeFigure;

            this.allFieldsUnderWhiteAttack.splice(0, this.allFieldsUnderWhiteAttack.length);
            this.allFieldsUnderWhiteAttack = this.getFieldsUnderAttack(1);
            this.allFieldsUnderBlackAttack.splice(0, this.allFieldsUnderBlackAttack.length);
            this.allFieldsUnderBlackAttack = this.getFieldsUnderAttack(-1);

            if (this.isWhiteTurn && this.whiteUnderCheck) {
                this.chessFieldModel[this.activeSquare as number].figure = this.activeFigure;
                this.chessFieldModel[event].figure = figureAtPoint;
                return;
            }
            if (!this.isWhiteTurn && this.blackUnderCheck) {
                this.chessFieldModel[this.activeSquare as number].figure = this.activeFigure;
                this.chessFieldModel[event].figure = figureAtPoint;
                return;
            } 

            if (this.castling.isWhiteShortCastlingEverPossible) this.checkCastling(1, 'short');
            if (this.castling.isWhiteLongCastlingEverPossible) this.checkCastling(1, 'long');
            if (this.castling.isBlackShortCastlingEverPossible) this.checkCastling(-1, 'short');
            if (this.castling.isBlackLongCastlingEverPossible) this.checkCastling(-1, 'long');

            this.clearTableAfterTurn();
            this.isWhiteTurn = !this.isWhiteTurn;

            socket.emit('postData', this.chessFieldModel);
        },

        clearTableAfterTurn(): void {
            this.activeSquare = null;
            this.activeFigure = null;
            this.possibleTurnes.splice(0, this.possibleTurnes.length);
            this.chessFieldModel.forEach(item => {
                item.possibleTurn = false;
                item.isActive = false;
            });

            this.isFigureActive = false;
        },

        getFieldsUnderAttack(side: number): number[] {
            let fieldsUnderAttack: number[] = [];

            let pawnsPositions: number[] = [];
            let kingPosition: number = 0;
            let queenPositions: number[] = [];
            let bishopsPositions: number[] = [];
            let knightsPositions: number[] = [];
            let rocksPositions: number[] = [];

            this.chessFieldModel.forEach((item, index) => {
                if (item.figure === side * 1) pawnsPositions.push(index);
                if (item.figure === side * 2) kingPosition = index;
                if (item.figure === side * 3) queenPositions.push(index);
                if (item.figure === side * 4) bishopsPositions.push(index);
                if (item.figure === side * 5) knightsPositions.push(index);
                if (item.figure === side * 6) rocksPositions.push(index);
            });

            pawnsPositions.forEach(item => fieldsUnderAttack.push(...PawnApi.calcAttackedFields(this.chessFieldModel, side * 1, item)));
            fieldsUnderAttack.push(...KingApi.calcPossibleTurns(this.chessFieldModel, side * 2, kingPosition));
            queenPositions.forEach(item => fieldsUnderAttack.push(...QueenApi.calcPossibleTurns(this.chessFieldModel, side * 3, item)));
            bishopsPositions.forEach(item => fieldsUnderAttack.push(...BishopApi.calcPossibleTurns(this.chessFieldModel, side * 4, item)));
            knightsPositions.forEach(item => fieldsUnderAttack.push(...KnightApi.calcPossibleTurns(this.chessFieldModel, side * 5, item)));
            rocksPositions.forEach(item => fieldsUnderAttack.push(...RockApi.calcPossibleTurns(this.chessFieldModel, side * 6, item)));

            return fieldsUnderAttack;
        },

        completePawnPropogation(event: number): void {
            this.chessFieldModel[<number>this.pawnForPromotionPosition].figure = event;
            this.allFieldsUnderWhiteAttack.splice(0, this.allFieldsUnderWhiteAttack.length);
            this.allFieldsUnderWhiteAttack = this.getFieldsUnderAttack(1);
            this.allFieldsUnderBlackAttack.splice(0, this.allFieldsUnderBlackAttack.length);
            this.allFieldsUnderBlackAttack = this.getFieldsUnderAttack(-1);
            socket.emit('promotion', this.chessFieldModel);
        },

        checkCastling(side: number, type: string): void {
            if (side > 0)
                switch (type) {
                    default:
                    case 'short':
                        if (this.chessFieldModel[60].figure !== 2 || this.chessFieldModel[63].figure !== 6) this.castling.isWhiteShortCastlingEverPossible = false; break;
                    case 'long':
                        if (this.chessFieldModel[60].figure !== 2 || this.chessFieldModel[56].figure !== 6) this.castling.isWhiteLongCastlingEverPossible = false; break;
                }
            else
                switch (type) {
                    default:
                    case 'short':
                        if (this.chessFieldModel[4].figure !== -2 || this.chessFieldModel[0].figure !== -6) this.castling.isBlackShortCastlingEverPossible = false; break;
                    case 'long':
                        if (this.chessFieldModel[4].figure !== -2 || this.chessFieldModel[7].figure !== -6) this.castling.isBlackLongCastlingEverPossible = false; break;
                }
        }
    },

    mounted() {
            socket.on('getData', (data: {data: SquareInterface[], activeSide: boolean}) => {
                this.chessFieldModel = data.data;
                this.isWhiteTurn = data.activeSide;
            });
    }
});

const setTableHeight = function(): void {
    const chessTable: HTMLElement | null = document.querySelector('.chess-table');
    if (chessTable) {
        chessTable.style.height = chessTable.clientWidth + 'px';
    }
};

window.addEventListener('load', () => {
    setTimeout(() => { setTableHeight() }, 10)}, false);

window.addEventListener('resize', () => {
    setTimeout(() => { setTableHeight() }, 10)}, false);
</script>
<style scoped>
.chess-table {
    position: relative;
    max-width: 560px;
    max-height: 560px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    border: 15px solid #49290c
}

.super-pawn-menu {
    position: absolute;
    top: calc(50% - 70px);
    left: calc(50% - 70px);
    width: 140px;
    height: 140px;
    border: 10px solid #49290c;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    z-index: 1050;
}

.super-pawn-menu > div {
    width: calc(100% / 2);
    height: calc(100% / 2);
}

.play-stoper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    background-color: #3333338c;
}

.letters {
    height: 15px;
    width: 100%;
    color: #ffffff;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>
