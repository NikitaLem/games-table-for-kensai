/*
figure: {
    -6: 'Black Rock'
    -5: 'Black Knight'
    -4: 'Black Bishop',
    -3: 'Black Queen',
    -2: 'Black King',
    -1: 'Black Pawn',
    0: 'Empty field',
    1: 'White Pawn',
    2: 'White King',
    3: 'White Queen',
    4: 'White Bishop',
    5: 'White Knight',
    6: 'White Rock'
}
*/
export default interface SquareInterface {
    figure?: number | null;
    squareColor?: string;
    possibleTurn?: boolean;
    isActive?: boolean;
}