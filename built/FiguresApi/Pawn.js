export default class PawnApi {
    //возможные ходы для пешки
    static calcPossibleTurns(table, figure, position) {
        let possibleTurnes = [];
        if (figure < 0) {
            if (position > 7 && position < 16) {
                if (table[position + 8].figure === 0)
                    possibleTurnes.push(position + 8);
                if (table[position + 8].figure === 0 && table[position + 16].figure === 0)
                    possibleTurnes.push(position + 16);
            }
            else if (table[position + 8] && table[position + 8].figure === 0)
                possibleTurnes.push(position + 8);
            if (table[position + 7] && (position % 8 !== 0) && table[position + 7].figure > 0)
                possibleTurnes.push(position + 7);
            if (table[position + 9] && (position + 1) % 8 !== 0 && table[position + 9].figure > 0)
                possibleTurnes.push(position + 9);
        }
        else {
            if (position > 47 && position < 56 && table[position - 8].figure === 0) {
                if (table[position - 8].figure === 0)
                    possibleTurnes.push(position - 8);
                if (table[position - 8].figure === 0 && table[position - 16].figure === 0)
                    possibleTurnes.push(position - 16);
            }
            else if (table[position - 8] && table[position - 8].figure === 0)
                possibleTurnes.push(position - 8);
            if (table[position - 7] && (position + 1) % 8 !== 0 && table[position - 7].figure < 0)
                possibleTurnes.push(position - 7);
            if (table[position - 9] && (position % 8 !== 0) && table[position - 9].figure < 0)
                possibleTurnes.push(position - 9);
        }
        return possibleTurnes;
    }
    static calcAttackedFields(table, figure, position) {
        let attackedFields = [];
        if (figure < 0) {
            if (table[position + 7] && (position % 8 !== 0))
                attackedFields.push(position + 7);
            if (table[position + 9] && (position + 1) % 8 !== 0)
                attackedFields.push(position + 9);
        }
        else {
            if (table[position - 7] && (position + 1) % 8 !== 0)
                attackedFields.push(position - 7);
            if (table[position - 9] && (position % 8 !== 0))
                attackedFields.push(position - 9);
        }
        return attackedFields;
    }
}
//# sourceMappingURL=Pawn.js.map