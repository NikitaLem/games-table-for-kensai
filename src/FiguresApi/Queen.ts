import SquareInterface from "../Interfaces/SquareInterface";
import BishopApi from "./Bishop";
import RockApi from "./Rock";

export default class QueenApi {
    //возможные ходы для ладьи
    static calcPossibleTurns(table: SquareInterface[], figure: number, position: number): number[] {
        let possibleTurnes: number[] = [...BishopApi.calcPossibleTurns(table, figure, position), ...RockApi.calcPossibleTurns(table, figure, position)];

        return possibleTurnes;
    }
}