export interface GameStateCtorParams {
  startGameEvent: CallableFunction;
  endGameEvent: CallableFunction;
  waitRoundEvent: CallableFunction;
  playRoundEvent: CallableFunction;
}

export class GameState {
  roundNumber = -1;
  roundUsers: string[] = [];
  roundStartTime = Date.now();
  state: 'wait' | 'play' = 'wait';

  private startGameEvent: CallableFunction;
  endGameEvent: CallableFunction;

  private waitRoundEvent: CallableFunction;
  private playRoundEvent: CallableFunction;

  constructor({ startGameEvent, endGameEvent, waitRoundEvent, playRoundEvent }: GameStateCtorParams) {
    this.startGameEvent = startGameEvent;
    this.endGameEvent = endGameEvent;
    this.waitRoundEvent = waitRoundEvent;
    this.playRoundEvent = playRoundEvent;
    this.startGameEvent();
  }

  nextRound() {
    this.roundNumber++;
    this.roundUsers = [];
    this.state = 'wait';
    this.roundStartTime = Date.now();
    this.waitRoundEvent();
  }

  playRound() {
    this.state = 'play';
    this.playRoundEvent();
  }
}
