export type Suite = "spatiq" | "karo" | "kupa" | "pika";
export type Value = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "J" | "Q" | "K";
export type Card = [Suite, Value];

export type Mode = Suite | "bezkoz" | "vsichko" | "pas"

export interface Table {
    startingPos: number;
    playerOrder: string[];
}

export interface GameState {
    turn: number;
    table: Table;
    calls: Mode[];
    // Ako igrata e "pas" znachi sa 4 pasa i se propuska
    mode: Mode | undefined;
    players: Card[][];
    won: Card[][];
    pot: Card[];
    faceUp: Card[];
}

export function copyState(s: GameState): GameState {
    return {
        turn: s.turn,
        table: s.table,
        calls: [...s.calls],
        mode: s.mode,
        players: s.players.map(t=>[...t]),
        pot: [...s.pot],
        faceUp: [...s.faceUp],
        won: s.won.map(t=>[...t]),
    }
}

/**
 * При дадени разбъркани карти и маса с играчи (определяща реда на играчите), връща началното състояние на играта. Тоест, състоянието след като
 * са раздадени по 5 карти на всеки играч, и преди да започне вдигането.
 * 
 * @param shuffle {Card[]} разбърканите карти
 * @param table {Table} дефиниция на масата
 */
export function initialState(shuffle: Card[], table: Table): GameState {
    if (table.playerOrder.length !== 4) {
        throw new Error(`Internal error`);
    }

    return {
        turn: 0,
        table,
        calls: [],
        mode: undefined,
        players: [0,1,2,3].map((i) => shuffle.slice(i*3, (i+1)*3).concat(shuffle.slice(12+i*2, 12+(i+1)*2))),
        pot: shuffle.slice(20),
        faceUp: [],
        won: [[], [], [], []]
    }
}

export interface Move {
    player: string;
    action: "call" | "card";
    object: Mode | Card;
}