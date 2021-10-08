import { DemoFile, BaseEntity, CInferno, Player } from "demofile";
const fs = require("fs");
const chalk = require("chalk");
const log = console.log;
var _ = require("lodash");

//const SEED = 1146049601;
const molotovExplode = 3580951569; // murmurHash2("inferno.start", SEED);
const incExplode = 1110819271; // murmurHash2("inferno.start_incgrenade", SEED);

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
          switch (key) {
            case "Molotov":
              log(chalk.red.bold(`${key}: ${grenades[key].length}`).padEnd(30));
              break;
            case "Incendiary":
              log(chalk.red.bold(`${key}: ${grenades[key].length}`).padEnd(30));
              break;
            case "Smoke":
              log(
                chalk.green.bold(`${key}: ${grenades[key].length}`).padEnd(30)
              );
              break;
            case "Grenade":
              log(
                chalk.yellow.bold(`${key}: ${grenades[key].length}`).padEnd(30)
              );
              break;
            case "Flashbang":
              log(
                chalk.white.bold(`${key}: ${grenades[key].length}`).padEnd(30)
              );
              break;
            case "Decoy":
              log(
                chalk.cyan.bold(`${key}: ${grenades[key].length}`).padEnd(30)
              );
              break;
          }
          grenades[key].forEach((grenade) => {
            console.log(`-- ${grenade.tick}`);
          });
          console.log("----------------");
        }
      });
    });
    log(chalk.bgRed.bold("        ******* END *******        "));
  }

  demofile.gameEvents.on("decoy_detonate", (event) => {
    const thrower = demofile.entities.getByUserId(event.userid);
    addGrenade("Decoy", thrower.steamId);
  });

  demofile.gameEvents.on("hegrenade_detonate", (event) => {
    const thrower = demofile.entities.getByUserId(event.userid);
    addGrenade("Grenade", thrower.steamId);
  });

  demofile.on("svc_Sounds", (e) => {
    for (const sound of e.sounds) {
      if (
        sound.soundNumHandle !== molotovExplode &&
        sound.soundNumHandle !== incExplode
      ) {
        continue;
      }

      const inferno = (demofile.entities.entities.get(
        sound.entityIndex
      ) as unknown) as BaseEntity<CInferno>;

      const thrower = inferno.owner as Player;
      const isMolotov = sound.soundNumHandle === molotovExplode;

      addGrenade(isMolotov ? "Molotov" : "Incendiary", thrower.steamId);
    }
  });

  demofile.gameEvents.on("flashbang_detonate", (event) => {
    const thrower = demofile.entities.getByUserId(event.userid);
    addGrenade("Flashbang", thrower.steamId);
  });
  demofile.gameEvents.on("smokegrenade_detonate", (event) => {
    const thrower = demofile.entities.getByUserId(event.userid);
    addGrenade("Smoke", thrower.steamId);
  });

  demofile.on("end", () => {
    logEndGame();
  });

  demofile.parse(buffer);
});
