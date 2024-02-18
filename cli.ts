import repl from "node:repl";
import EventEmitter from "events";
import { Command } from "@commander-js/extra-typings";
import { parse } from "shell-quote";

import { createContainer } from "./src/domain/container";
import { inMemoryDatabaseClient } from "./src/infrastructure/database/in-memory/client";
import { createAuction } from "./src/apps/cli/commands/create-auction.command";
import { getAuction } from "./src/apps/cli/commands/get-auction.command";
import { placeBid } from "./src/apps/cli/commands/place-bid.command";

const container = createContainer(inMemoryDatabaseClient);

const createProgram = () => {
  const program = new Command();
  program
    .name("auction")
    .description("CLI to interact with auction platform")
    .version("0.8.0");

  createAuction(program, container);

  getAuction(program, container);

  placeBid(program, container);

  return program;
};

repl.start({
  eval: async (line, _, __, callback) => {
    try {
      const program = createProgram();
      await program.parseAsync(parse(line) as string[], {
        from: "user",
      });
    } catch (error) {
      callback(error as Error, "");
    }
  },
});
