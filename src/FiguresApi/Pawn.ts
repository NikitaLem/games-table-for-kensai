import SquareInterface from "../Interfaces/SquareInterface";

export default class PawnApi {
    //возможные ходы для пешки
    static calcPossibleTurns(table: SquareInterface[], figure: number, position: number): number[] {
        let possibleTurnes: number[] = [];
            if (figure < 0) {
                if (position > 7 && position < 16) {
                    if (table[position + 8].figure === 0) possibleTurnes.push(position + 8);
                    if (table[position + 8].figure === 0 && table[position + 16].figure === 0) possibleTurnes.push(position + 16);
                } else if (table[position + 8] && table[position + 8].figure === 0)
                    possibleTurnes.push(position + 8);

                if (table[position + 7] && (position % 8 !== 0) && <number>table[position + 7].figure > 0)
                    possibleTurnes.push(position + 7);

                if (table[position + 9] && (position + 1) % 8 !== 0 && <number>table[position + 9].figure > 0)
                    possibleTurnes.push(position + 9);

            } else {
                if (position > 47 && position < 56 && table[position - 8].figure === 0) {
                    if (table[position - 8].figure === 0) possibleTurnes.push(position - 8);
                    if (table[position - 8].figure === 0 && table[position - 16].figure === 0) possibleTurnes.push(position - 16);
                } else if (table[position - 8] && table[position - 8].figure === 0)
                    possibleTurnes.push(position - 8);

                if (table[position - 7] && (position + 1) % 8 !== 0 && <number>table[position - 7].figure < 0)
                    possibleTurnes.push(position - 7);

                if (table[position - 9] && (position % 8 !== 0) && <number>table[position - 9].figure < 0)
                    possibleTurnes.push(position - 9);
            }

            return possibleTurnes;
    }

    static calcAttackedFields(table: SquareInterface[], figure: number, position: number): number[] {
        let attackedFields: number[] = [];

        if (figure < 0) {
            if (table[position + 7] && (position % 8 !== 0))
                attackedFields.push(position + 7);

            if (table[position + 9] && (position + 1) % 8 !== 0)
                attackedFields.push(position + 9);
        } else {
            if (table[position - 7] && (position + 1) % 8 !== 0)
                attackedFields.push(position - 7);
            
            if (table[position - 9] && (position % 8 !== 0))
                attackedFields.push(position - 9);
        }
            
            return attackedFields;
    }
}