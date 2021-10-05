// todo usar como number o length do array de ticks

interface GrenadeStats {
  ticks: Array<number>
};

// verificar record pra fazer o objeto de players

// verificar se partial faz sentido

interface PlayerStats {
  userId: number,
  name: string,
  steamId: string,
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
  players: Record<number, PlayerStats> = {};

  addPlayer(player: PlayerStats) {
    this.players[player.userId] = {
        userId: player.userId,
        name: player.name,
        steamId: player.steamId
    }
  }

  createRoundKey(currentRound: number) {
    Object.values(this.players).forEach(player => {
        player[`round${currentRound+1}`] = {};
    });
  }

//   parsePlayersArray() {
//     this.players.forEach((player) => {
//       console.log(`Player [${player.name}]`);
//       if (player.hegrenade) {
//         console.log(`--HE: ${player.hegrenade.number}`);
//         player.hegrenade.ticks.forEach((tick) => console.log(`---${tick}`));
//       }
//       if (player.flashbanggrenade) {
//         console.log(`--Flashes: ${player.flashbanggrenade.number}`);
//         player.flashbanggrenade.ticks.forEach((tick) =>
//           console.log(`---${tick}`)
//         );
//       }
//       if (player.decoygrenade) {
//         console.log(`--Decoys: ${player.decoygrenade.number}`);
//         player.decoygrenade.ticks.forEach((tick) => console.log(`---${tick}`));
//       }
//       if (player.smokegrenade) {
//         console.log(`--Smokes: ${player.smokegrenade.number}`);
//         player.smokegrenade.ticks.forEach((tick) => console.log(`---${tick}`));
//       }
//       console.log("------------");
//     });
//   }

//   incrementRound() {
//     this.currentRound = this.currentRound + 1;
//   }

  addGrenade(grenade: GrenadeVariation, currentRound: number, grenadeTick: number, userId: number) {
    // todo refatorar com menos indexação, de brackets por exemplo pra melhor leitura
    const player = this.players[userId];
    console.log(player);
    const round = `round${currentRound}`;
    player[round]= {
        [grenade]: {
            ticks: grenadeTick
        }
    }
    console.log(player)
  }

//   logRoundStats() {
//     console.log(`***Round ${this.currentRound}***`);
//     console.log("**************************");
//     this.parsePlayersArray();
//   }
}
