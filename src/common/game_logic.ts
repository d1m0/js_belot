import { Card, copyState, GameState, Mode, Move, Suite } from "./game_state";

class GameLogicError extends Error {
    constructor(msg: string, state: GameState, move: Move) {
        super(msg);
    }
}

/**
 * Vrushta 'rezhima' na igrata, spored tova koi kakvo e vikal. Ako oshte ne e prikliuchilo vdiganeto
 * vrushta undefined
 * 
 * @param s {GameState}
 */
function calledMode(s: GameState): Mode | undefined {
    const nCalls = s.calls.length;

    // Ако някой е викал всичко, давай. Ако s.calls e празно, тогава
    // това индексирането връща undefined
    if (s.calls[nCalls-1] === "vsichko") {
        return "vsichko"
    }

    // Ако не трябва да има поне 4 гласа
    if (nCalls < 4) {
        return undefined;
    }

    // Последните 3 трябва да са пас
    if (s.calls[nCalls-1] !== 'pas' ||
        s.calls[nCalls-2] !== 'pas' ||
        s.calls[nCalls-3] !== 'pas'
    ) {
        return undefined;
    }

    return s.calls[nCalls-4];
}

const callOrder: Mode[] = ["spatiq", "karo", "kupa", "pika", "bezkoz", "vsichko"]

/**
 * Vrushta `true` ako a e "po-malko" po reda na vdigane ot b
 * @param a {Mode}
 * @param b {Mode}
 */
function ltCall(a: Mode, b: Mode): boolean {
    return callOrder.indexOf(b) > callOrder.indexOf(a);
}

function ima(deck: Card[], boq: Suite): boolean {
    return deck.filter((card) => card[0] === boq).length > 0;
}

/**
 * Връща дали новата карта отговаря на това което се търси от вече хвърлените карти.
 *  
 * @param hvurleni {Card[]} картите които са вече хвърлени
 * @param nova {Card} новата карта
 * @param igra {Mode} видът игра (боя, безкоз...)
 */
function otgovarq(hvurleni: Card[], nova: Card, playerIdx: number, s: GameState): boolean {
    if (hvurleni.length === 0) {
        return true;
    }

    if (s.mode !== "bezkoz" && s.mode !== "vsichko" ) {
        // Игране на боя
        const koz = s.mode as Suite;
        const tursenaBoq = hvurleni[0][0];

        // Играча отговаря
        if (nova[0] == tursenaBoq) {
            return true;
        }

        // Ако играча има да отговори, трябва да отговори
        if (ima(s.players[playerIdx], tursenaBoq)) {
            return false;
        }

        // Ако 
    }

    throw new Error("NYI")
}

function vzima(hvurleni: Card[], nova: Card, playerIdx: number, s: GameState): number | undefined {
    throw new Error("NYI")
}

export function makeMove(s: GameState, move: Move): GameState {
    const playerIdx: number = (s.table.startingPos + s.turn) % 4
    const playerName = s.table.playerOrder[playerIdx]

    if (move.player !== playerName) {
        throw new GameLogicError(`Не е редът на играчът ${move.player}`, s, move);
    }

    const nextState = copyState(s);
    nextState.turn++;

    if (move.action === "call") {
        if (s.mode !== undefined) {
            throw new GameLogicError(`Не може да се вдига след като е решена боя`, s, move)
        }

        if ((move.object instanceof Array)) {
            throw new Error('Internal Error')
        }

        const curCall = move.object as Mode;

        if (s.calls.length > 0) {
            const lastCall = s.calls[s.calls.length-1];
            if (move.object !== "pas" && !ltCall(lastCall, curCall)) {
                throw new GameLogicError(`Трябва или да се вдигне или да се вика пас.`, s, move)
            }
        }

        nextState.calls = s.calls.concat([curCall]);
        nextState.mode = calledMode(nextState);
        return nextState
    } else {
        if (s.mode === undefined) {
            throw new GameLogicError(`Не може да се играе карта преди да е решена боя`, s, move)
        }

        if (!(move.object instanceof Array)) {
            throw new Error('Internal Error')
        }

        const card = move.object;
        const cardHandIdx = s.players[playerIdx].indexOf(card);

        if (!(cardHandIdx < 0)) {
            throw new GameLogicError(`Играчът ${playerName} няма картата ${card}`, s, move)
        }

        if (!otgovarq(s.faceUp, card, s.mode)) {
            throw new GameLogicError(`Картата ${card} не отговаря на това което се очаква`, s, move)
        }


        const pecheliRukata = vzima(s.faceUp, card, playerIdx, s)

        nextState.faceUp.push(card);
        nextState.players[playerIdx].splice(cardHandIdx, 1);

        if (pecheliRukata !== undefined) {
            nextState.won[pecheliRukata].push(...nextState.faceUp)
            nextState.faceUp = [];
        }
    }

    return nextState;
}