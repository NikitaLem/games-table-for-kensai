import BishopApi from "./Bishop";
import RockApi from "./Rock";
export default class QueenApi {
    //возможные ходы для ладьи
    static calcPossibleTurns(table, figure, position) {
        let possibleTurnes = [...BishopApi.calcPossibleTurns(table, figure, position), ...RockApi.calcPossibleTurns(table, figure, position)];
        return possibleTurnes;
    }
}
//# sourceMappingURL=Queen.js.map