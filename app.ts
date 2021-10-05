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

    demoFile.entities.on("create", (e) => {
      // We're only interested in player entities being created.
      if (!(e.entity instanceof Player)) {
        return;
      }
      const player = {
        userId: e.entity.userId,
        name: e.entity.name,
        steamId: e.entity.steamId,
      };
      round.addPlayer(player);
    });

    demoFile.on("end", (e) => {
      if (e.error) {
        console.error("Error during parsing:", e.error);
      }

      console.log("Finished.");
    });

    demoFile.gameEvents.on("round_start", () => {
      const currentRound = demoFile.gameRules.roundsPlayed;
      round.createRoundKey(currentRound);
    });

    demoFile.gameEvents.on("round_end", () => {
      // round.logRoundStats();
      // round.incrementRound();
    });

    demoFile.gameEvents.on("hegrenade_detonate", (e) => {
      const player = demoFile.entities.getByUserId(e.userid);
      const grenadeTick = demoFile.currentTick;
      const currentRound = demoFile.gameRules.roundsPlayed;
      round.addGrenade("hegrenade", currentRound, grenadeTick, player.userId);
    });
    demoFile.gameEvents.on("smokegrenade_detonate", (e) => {
      const player = demoFile.entities.getByUserId(e.userid);
      const grenadeTick = demoFile.currentTick;
      const currentRound = demoFile.gameRules.roundsPlayed;
      round.addGrenade("smokegrenade", currentRound, grenadeTick, player.userId);
    });
    demoFile.gameEvents.on("flashbang_detonate", (e) => {
      const player = demoFile.entities.getByUserId(e.userid);
      const grenadeTick = demoFile.currentTick;
      const currentRound = demoFile.gameRules.roundsPlayed;
      round.addGrenade("flashbanggrenade", currentRound, grenadeTick, player.userId);
    });
    demoFile.gameEvents.on("decoy_detonate", (e) => {
      const player = demoFile.entities.getByUserId(e.userid);
      const grenadeTick = demoFile.currentTick;
      const currentRound = demoFile.gameRules.roundsPlayed;
      round.addGrenade("decoygrenade", currentRound , grenadeTick, player.userId);
    });

    // Start parsing the buffer now that we've added our event listeners
    demoFile.parse(buffer);
  });
}

parseDemoFile(process.argv[2]);
