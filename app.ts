// tslint:disable:no-console

// This file is an thorough example of how to log player kills,
// team scores, chat text and server cvar changes from a demo file.

import * as assert from "assert";
import * as fs from "fs";
import * as util from "util";
import { Round } from "./utils";
import { DemoFile, Player, TeamNumber } from "demofile";

function parseDemoFile(path: string) {
  fs.readFile(path, (err, buffer) => {
    assert.ifError(err);

    const demoFile = new DemoFile();

    const round = new Round();

    demoFile.on("end", (e) => {
      if (e.error) {
        console.error("Error during parsing:", e.error);
      }

      console.log("Finished.");
    });

    demoFile.gameEvents.on("round_end", () => {
      round.logRoundStats();
      round.incrementRound();
      round.resetPlayersArray();
    });

    demoFile.gameEvents.on("hegrenade_detonate", (e) => {
      const player = demoFile.entities.getByUserId(e.userid);
      const grenadeTick = demoFile.currentTick;
      round.addGrenade("hegrenade", player, grenadeTick);
    });
    demoFile.gameEvents.on("smokegrenade_detonate", (e) => {
      const player = demoFile.entities.getByUserId(e.userid);
      const grenadeTick = demoFile.currentTick;
      round.addGrenade("smokegrenade", player, grenadeTick);
    });
    demoFile.gameEvents.on("flashbang_detonate", (e) => {
      const player = demoFile.entities.getByUserId(e.userid);
      const grenadeTick = demoFile.currentTick;
      round.addGrenade("flashbanggrenade", player, grenadeTick);
    });
    // demoFile.gameEvents.on("decoy_detonate", (e) => {
    //   const player = demoFile.entities.getByUserId(e.userid);
    //   const grenadeTick = demoFile.currentTick;
    //   round.addPlayer(player);
    //   round.addGrenade("decoygrenade", player, grenadeTick);
    // });

    // Start parsing the buffer now that we've added our event listeners
    demoFile.parse(buffer);
  });
}

parseDemoFile(process.argv[2]);
