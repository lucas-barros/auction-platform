import { Command } from "@commander-js/extra-typings";
import { Container } from "../../../domain/container";
import { auctionService } from "../../../domain/services/auction.service";
import { createAuctionUseCase } from "../../../domain/use-cases/auction.case";

export const placeBid = (program: Command, container: Container) => {
  program
    .command("place-bid")
    .description("Place a bid in an auction")
    .option("-u, --username <username>", "Username")
    .option("-i, --id <id>", "Auction id")
    .option("-v, --value <value>", "Bid value")
    .action((options) => {
      const username = options.username || "";
      const auctionId = options.id || "";
      const value = Number(options.value);
      const useCase = createAuctionUseCase(
        container.repository,
        auctionService
      );

      const result = useCase.placeBid({ username, auctionId, value });

      if (result.isOk()) {
        console.log(result.value);
      } else {
        console.error(result.error);
      }
    });
};
