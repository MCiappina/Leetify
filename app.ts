const DemoFile = require("demofile");
const fs = require("fs");
const chalk = require("chalk");

fs.readFile("demo.dem", (err, buffer) => {
  const demofile = new DemoFile.DemoFile();
  const stats = {};

  function log(grenade, userId) {
    const player = demofile.players.find((player) => player.userId === userId);
    const round = demofile.gameRules.roundsPlayed + 1;

    if (stats[player.userId] === undefined) {
      stats[player.userId] = {
        name: player.name,
        steamId: player.steamId,
        [round]: {
          Decoy: [],
          Grenade: [],
          Molotov: [],
          Flashbang: [],
        },
        ...stats[player.userId],
      };
      stats[player.userId][round][grenade].push(demofile.currentTick);
    } else {
      stats[player.userId] = {
        ...stats[player.userId],
        [round]: {
          Decoy: [],
          Grenade: [],
          Molotov: [],
          Flashbang: [],
        },
      };
      stats[player.userId][round][grenade].push(demofile.currentTick);
    }
  }

  demofile.gameEvents.on("decoy_detonate", (event) => {
    log("Decoy", event.userid);
  });

  demofile.gameEvents.on("hegrenade_detonate", (event) => {
    log("Grenade", event.userid);
  });

  demofile.gameEvents.on("molotov_detonate", (event) => {
    log("Molotov", event.userid);
  });

  demofile.gameEvents.on("flashbang_detonate", (event) => {
    log("Flashbang", event.userid);
  });

  demofile.on("end", () => {
    Object.values(stats).forEach((entry) => {
      console.log(entry);
    });
  });

  demofile.parse(buffer);
});
