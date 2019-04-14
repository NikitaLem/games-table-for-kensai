<template>
    <div class="chess__square" :class="[figureOnIt, {active: isActive}, {possibleTurn: possibleTurn}]" :style="{backgroundColor: backgroundColor}"
        @click="startOfEndTurn($event)"
    ></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: 'Square',
    props: {
        numberOfField: {
            type: Number,
            default: null,
        },

        backgroundColor: {
            type: String,
            default: '',
        },

        state: {
            type: Number,
            default: 0,
        },

        possibleTurn: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: false,
        },

        isWhiteTurn: {
            type: Boolean,
            default: true,
        },

        playableSquare: {
            type: Boolean,
            default: true,
        },

        playerSide: {
            type: String,
            default: 'watcher',
        },
    },

    computed: {
        figureOnIt(): String {
            switch (this.state) {
                case -6: return 'chess__black-rock';
                case -5: return 'chess__black-knight';
                case -4: return 'chess__black-bishop';
                case -3: return 'chess__black-queen';
                case -2: return 'chess__black-king';
                case -1: return 'chess__black-pawn';
                case 6: return 'chess__white-rock';
                case 5: return 'chess__white-knight';
                case 4: return 'chess__white-bishop';
                case 3: return 'chess__white-queen';
                case 2: return 'chess__white-king';
                case 1: return 'chess__white-pawn';
                default: return 'chess__empty';
            }
        },   
    },

    methods: {
        startOfEndTurn(event: any): void {
            if (!this.playableSquare) {
                this.$emit('figure-picker', this.state);
                return;
            }

            if (this.playerSide === 'watcher') return;

            if (event.target.closest('.possibleTurn')) {
                this.$emit('figure-turned', this.numberOfField);
                return;
            }

            if (event.target.closest('.chess__empty')) return;
            if (this.isWhiteTurn && this.state < 0) return;
            if (!this.isWhiteTurn && this.state > 0) return;
            if (this.isWhiteTurn && this.playerSide === 'black') return;
            if (!this.isWhiteTurn && this.playerSide === 'white') return;
            
            this.$emit('figure-touched', this.numberOfField);
            return;
        }
    }
});
</script>

<style>
.chess__square {
    position: relative;
    box-sizing: border-box;
    width: calc(100% / 8);
    height: calc(100% / 8);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}

.active {
    background-color: #7ee67a !important;
}

.possibleTurn:before {
    content: '';
    position: absolute;
    top: calc(50% - 12.5px);
    left: calc(50% - 12.5px);
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: #85beff4f !important;
}

.chess__black-rock {
    background-image: url(../assets/black-rock.png);
    cursor: pointer;
}

.chess__black-knight {
    background-image: url(../assets/black-knight.png);
    cursor: pointer;
}

.chess__black-bishop {
    background-image: url(../assets/black-bishop.png);
    cursor: pointer;
}

.chess__black-queen {
    background-image: url(../assets/black-queen.png);
    cursor: pointer;
}

.chess__black-king {
    background-image: url(../assets/black-king.png);
    cursor: pointer;
}

.chess__black-pawn {
    background-image: url(../assets/black-pawn.png);
    cursor: pointer;
}

.chess__white-rock {
    background-image: url(../assets/white-rock.png);
    cursor: pointer;
}

.chess__white-knight {
    background-image: url(../assets/white-knight.png);
    cursor: pointer;
}

.chess__white-bishop {
    background-image: url(../assets/white-bishop.png);
    cursor: pointer;
}

.chess__white-king {
    background-image: url(../assets/white-king.png);
    cursor: pointer;
}

.chess__white-pawn {
    background-image: url(../assets/white-pawn.png);
    cursor: pointer;
}

.chess__white-queen {
    background-image: url(../assets/white-queen.png);
    cursor: pointer;
}
</style>