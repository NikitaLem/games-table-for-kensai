import SquareInterface from "../Interfaces/SquareInterface";

export default class KnightApi {
    //возможные ходы для коня
    static calcPossibleTurns(table: SquareInterface[], figure: number, position: number): number[] {
        const figureSide = Math.sign(figure);
        let possibleTurnes: number[] = [];

        if (table[position - 17] && position % 8 !== 0 && (table[position - 17].figure === 0 || Math.sign(<number>table[position - 17].figure) !== figureSide))
            possibleTurnes.push(position - 17);

        if (table[position - 15] && (position + 1) % 8 !== 0 && (table[position - 15].figure === 0 || Math.sign(<number>table[position - 15].figure) !== figureSide))
            possibleTurnes.push(position - 15);

        if (table[position + 17] && (position + 1) % 8 !== 0 && (table[position + 17].figure === 0 || Math.sign(<number>table[position + 17].figure) !== figureSide))
            possibleTurnes.push(position + 17);

        if (table[position + 15] && position % 8 !== 0 && (table[position + 15].figure === 0 || Math.sign(<number>table[position + 15].figure) !== figureSide))
            possibleTurnes.push(position + 15);

        if (table[position - 10] && position % 8 !== 0 && (position - 1) % 8 !== 0 && (table[position - 10].figure === 0 || Math.sign(<number>table[position - 10].figure) !== figureSide))
            possibleTurnes.push(position - 10);

        if (table[position - 6] && (position + 2) % 8 !== 0 && (position + 1) % 8 !== 0 && (table[position - 6].figure === 0 || Math.sign(<number>table[position - 6].figure) !== figureSide))
            possibleTurnes.push(position - 6);

        if (table[position + 10] && (position + 2) % 8 !== 0 && (position + 1) % 8 !== 0 && (table[position + 10].figure === 0 || Math.sign(<number>table[position + 10].figure) !== figureSide))
            possibleTurnes.push(position + 10);

        if (table[position + 6] && position % 8 !== 0 && (position - 1) % 8 !== 0 && (table[position + 6].figure === 0 || Math.sign(<number>table[position + 6].figure) !== figureSide))
            possibleTurnes.push(position + 6);

        return possibleTurnes;
    }
}