import { Player } from "demofile";

// todo usar como number o length do array de ticks

type GrenadeStats = {
  number: number;
  ticks: Array<number>;
};

// verificar record pra fazer o objeto de players

// verificar se partial faz sentido

interface PlayerStats extends Player {
  hegrenade?: GrenadeStats;
  flashbanggrenade?: GrenadeStats;
  decoygrenade?: GrenadeStats;
  incendiarygrenade?: GrenadeStats;
  molotovgrenade?: GrenadeStats;
  smokegrenade?: GrenadeStats;
}

type GrenadeVariation =
  | "hegrenade"
  | "flashbanggrenade"
  | "decoygrenade"
  | "incendiarygrenade"
  | "molotovgrenade"
  | "smokegrenade";

export class Round {
  currentRound = 1;
  players: Array<PlayerStats> = [];

  addPlayer(player: PlayerStats) {
    const hydrated_player = player;
    const exists = (userId: number) => {
      return hydrated_player.userId === userId;
    };
    if (this.players) {
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
      if (player.hegrenade) {
        console.log(`--HE: ${player.hegrenade.number}`);
        player.hegrenade.ticks.forEach((tick) => console.log(`---${tick}`));
      }
      if (player.flashbanggrenade) {
        console.log(`--Flashes: ${player.flashbanggrenade.number}`);
        player.flashbanggrenade.ticks.forEach((tick) =>
          console.log(`---${tick}`)
        );
      }
      if (player.decoygrenade) {
        console.log(`--Decoys: ${player.decoygrenade.number}`);
        player.decoygrenade.ticks.forEach((tick) => console.log(`---${tick}`));
      }
      if (player.smokegrenade) {
        console.log(`--Smokes: ${player.smokegrenade.number}`);
        player.smokegrenade.ticks.forEach((tick) => console.log(`---${tick}`));
      }
      console.log("------------");
    });
  }

  incrementRound() {
    this.currentRound = this.currentRound + 1;
  }

  addGrenade(grenade: GrenadeVariation, player: Player, grenadeTick: number) {
    this.addPlayer(player);
    // todo refatorar com menos indexação, de brackets por exemplo pra melhor leitura
    const indexOfPlayer = this.players.findIndex(
      (playerElement) => playerElement.userId === player.userId
    );
    if (!this.players[indexOfPlayer][grenade]) {
      this.players[indexOfPlayer][grenade] = {
          number: 1,
          ticks: []
      }
    } else {
      this.players[indexOfPlayer][grenade].number += 1;
    }
    // todo tirar essas hydrated
    const hydrated_tick = grenadeTick;
    this.players[indexOfPlayer][grenade].ticks = [
      ...this.players[indexOfPlayer][grenade].ticks,
      hydrated_tick,
    ];
  }

  logRoundStats() {
    console.log(`***Round ${this.currentRound}***`);
    console.log("**************************");
    this.parsePlayersArray();
  }
}
