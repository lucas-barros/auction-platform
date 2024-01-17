import repl from "node:repl";
import EventEmitter from "events";
import { Command } from "@commander-js/extra-typings";
import { parse } from "shell-quote";

import { createContainer } from "./src/domain/container";
import { inMemoryDatabaseClient } from "./src/infrastructure/database/in-memory/client";
import { createAuction } from "./src/apps/cli/commands/create-auction.command";
import { getAuction } from "./src/apps/cli/commands/get-auction.command";
import { placeBid } from "./src/apps/cli/commands/place-bid.command";

const emitter = new EventEmitter();
const program = new Command();
const container = createContainer(inMemoryDatabaseClient);

program.hook("postAction", () => {
  emitter.emit("idle");
});

repl.start({
  eval: (line, _, __, callback) => {
    emitter.once("idle", callback);
    program.parse(["", "", ...(parse(line) as string[])]);
  },
});

program
  .name("auction")
  .description("CLI to interact with auction platform")
  .version("0.8.0");

createAuction(program, container);

getAuction(program, container);

placeBid(program, container);
