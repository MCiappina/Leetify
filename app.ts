import { DemoFile } from "demofile";
const fs = require("fs");
const chalk = require("chalk");
const log = console.log;
var _ = require("lodash");

enum GrenadeTypes {
  "weapon_smokegrenade" = "Smoke",
  "weapon_flashbang" = "Flashbang",
  "weapon_hegrenade" = "Grenade",
  "weapon_molotov" = "Molotov",
  "weapon_decoy" = "Decoy",
  "weapon_incgrenade" = "Incendiary",
}

enum GrenadeColors {
  "Smoke" = "green",
  "Flashbang" = "white",
  "Grenade" = "yellow",
  "Molotov" = "red",
  "Decoy" = "cyan",
  "Incendiary" = "red",  
}

const isGrenade = (weapon: string) => {
  return !!GrenadeTypes[weapon];
};

fs.readFile("demo.dem", (err, buffer) => {
  const demofile = new DemoFile();
  const stats = {};

  function addGrenade(grenade, steamId) {
    const player = demofile.players.find(
      (player) => player.steamId === steamId
    );

    if (stats[player.steamId] === undefined) {
      stats[player.steamId] = {
        name: player.name,
        utils: [],
      };
    }

    const grenadeStats = {
      round: demofile.gameRules.roundsPlayed + 1,
      tick: demofile.currentTick,
      type: grenade,
    };

    stats[player.steamId].steamId = steamId;
    stats[player.steamId].utils.push(grenadeStats);
  }

  function logEndGame() {
    const statsArray = Object.values(stats);
    statsArray.forEach((player) => {
      log(
        chalk.magenta.bold.italic(`${player["name"]} [${player["steamId"]}]`)
      );
      const rounds = Object.values(_.groupBy(player["utils"], "round"));
      rounds.forEach((round) => {
        log(
          chalk.bgRed.bold.underline(`  --- Round ${round[0]["round"]} ---  `)
        );
        const grenades = _.groupBy(round, "type");
        for (let key in grenades) {
          log(chalk[GrenadeColors[key]].bold(`${key}: ${grenades[key].length}`));
          grenades[key].forEach((grenade) => {
            console.log(`-- ${grenade.tick}`);
          });
          console.log("----------------");
        }
      });
    });
    log(chalk.bgRed.bold("        ******* END *******        "));
  }

  demofile.gameEvents.on("weapon_fire", (event) => {
    const { weapon, userid } = event;
    const thrower = demofile.entities.getByUserId(userid);
    if (isGrenade(weapon)) {
      addGrenade(GrenadeTypes[weapon], thrower.steamId);
    }
  });
  demofile.on("end", () => {
    logEndGame();
  });

  demofile.parse(buffer);
});
