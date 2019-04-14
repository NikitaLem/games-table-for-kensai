export default class RockApi {
    //возможные ходы для ладьи
    static calcPossibleTurns(table, figure, position) {
        const figureSide = Math.sign(figure);
        let possibleTurnes = [];
        const offsets = {
            topOffset: Math.floor(position / 8),
            rightOffset: 7 - position % 8,
            bottomOffset: 7 - Math.floor(position / 8),
            leftOffset: position % 8
        };
        for (let i = 1; i <= offsets.topOffset; i += 1) {
            if (table[position - 8 * i].figure !== 0) {
                if (Math.sign(table[position - 8 * i].figure) !== figureSide) {
                    possibleTurnes.push(position - 8 * i);
                    break;
                }
                else
                    break;
            }
            possibleTurnes.push(position - 8 * i);
        }
        for (let i = 1; i <= offsets.rightOffset; i += 1) {
            if (table[position + i].figure !== 0) {
                if (Math.sign(table[position + i].figure) !== figureSide) {
                    possibleTurnes.push(position + i);
                    break;
                }
                else
                    break;
            }
            possibleTurnes.push(position + i);
        }
        for (let i = 1; i <= offsets.bottomOffset; i += 1) {
            if (table[position + 8 * i].figure !== 0) {
                if (Math.sign(table[position + 8 * i].figure) !== figureSide) {
                    possibleTurnes.push(position + 8 * i);
                    break;
                }
                else
                    break;
            }
            possibleTurnes.push(position + 8 * i);
        }
        for (let i = 1; i <= offsets.leftOffset; i += 1) {
            if (table[position - i].figure !== 0) {
                if (Math.sign(table[position - i].figure) !== figureSide) {
                    possibleTurnes.push(position - i);
                    break;
                }
                else
                    break;
            }
            possibleTurnes.push(position - i);
        }
        return possibleTurnes;
    }
}
//# sourceMappingURL=Rock.js.map