import { Player } from "demofile";

export class Round {
  currentRound = 1;
  players: Array<Player> = [];

  addPlayer(player: Player) {
    const hydrated_player = player;
    const exists = (userId: number) => {
      return hydrated_player.userId === userId;
    };
    if (this.players.length) {
      if (this.players.some((player) => exists(player.userId))) {
        return;
      } else {
        this.players = [...this.players, hydrated_player];
      }
    } else {
      this.players = [...this.players, hydrated_player];
    }
  }

  resetPlayersArray() {
    this.players = [];
  }

  parsePlayersArray() {
    this.players.forEach((player) => {
      console.log(`Player [${player.name}]`);
      console.log("------------");
    });
  }

  incrementRound() {
    this.currentRound = this.currentRound + 1;
  }

  logRoundStats() {
    console.log(`***Round ${this.currentRound}***`);
    console.log("**************************");
    this.parsePlayersArray();
  }
}
