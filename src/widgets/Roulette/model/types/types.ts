import {User} from "../../../../entities/User/model/types/types";

export interface Round {
    id: number,
    game_id: number,
    roll: number,
    color: RouletteColor,
    start_time: number
}

export type RouletteColor = 'red' | 'green' | 'black';

export interface Bet {
    user: Partial<User>,
    round_id: number,
    bet_time: number;
    amount: number;
    bet_type: number;
    lower: number;
    upper: number;
    won: number;
}

export interface NewBet {
    bet_time: number;
    amount: number;
    bet_type: number;
    lower: number;
    upper: number;
}

export interface ServerState {
    last_results: number[],
    round_id: number,
    start_time: number,
    phase: 'betting' | 'rolling',
    bets: Bet[],
    result?: {
        color: RouletteColor,
        roll: number,
    }
}

export interface HistoryBet extends Omit<Bet, 'user'> {
    id: number;
    round: Round;
}

