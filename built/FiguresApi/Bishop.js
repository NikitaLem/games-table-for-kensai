export default class BishopApi {
    //возможные ходы для слона
    static calcPossibleTurns(table, figure, position) {
        const figureSide = Math.sign(figure);
        let possibleTurnes = [];
        const offsets = {
            topOffset: Math.floor(position / 8),
            rightOffset: 7 - position % 8,
            bottomOffset: 7 - Math.floor(position / 8),
            leftOffset: position % 8
        };
        const topRightMin = Math.min(offsets.topOffset, offsets.rightOffset);
        const rightBttomMin = Math.min(offsets.rightOffset, offsets.bottomOffset);
        const bottomLeftMin = Math.min(offsets.bottomOffset, offsets.leftOffset);
        const leftTopMin = Math.min(offsets.leftOffset, offsets.topOffset);
        for (let i = 1; i <= topRightMin; i += 1) {
            if (table[position - 8 * i + i].figure !== 0) {
                if (Math.sign(table[position - 8 * i + i].figure) !== figureSide) {
                    possibleTurnes.push(position - 8 * i + i);
                    break;
                }
                else
                    break;
            }
            possibleTurnes.push(position - 8 * i + i);
        }
        for (let i = 1; i <= rightBttomMin; i += 1) {
            if (table[position + 8 * i + i].figure !== 0)
                if (Math.sign(table[position + 8 * i + i].figure) !== figureSide) {
                    possibleTurnes.push(position + 8 * i + i);
                    break;
                }
                else
                    break;
            possibleTurnes.push(position + 8 * i + i);
        }
        for (let i = 1; i <= bottomLeftMin; i += 1) {
            if (table[position + 8 * i - i].figure !== 0)
                if (Math.sign(table[position + 8 * i - i].figure) !== figureSide) {
                    possibleTurnes.push(position + 8 * i - i);
                    break;
                }
                else
                    break;
            possibleTurnes.push(position + 8 * i - i);
        }
        for (let i = 1; i <= leftTopMin; i += 1) {
            if (table[position - 8 * i - i].figure !== 0)
                if (Math.sign(table[position - 8 * i - i].figure) !== figureSide) {
                    possibleTurnes.push(position - 8 * i - i);
                    break;
                }
                else
                    break;
            possibleTurnes.push(position - 8 * i - i);
        }
        return possibleTurnes;
    }
}
//# sourceMappingURL=Bishop.js.map