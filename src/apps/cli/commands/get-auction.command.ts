import { Command } from "@commander-js/extra-typings";
import { Container } from "../../../domain/container";
import { auctionService } from "../../../domain/services/auction.service";
import { createAuctionUseCase } from "../../../domain/use-cases/auction.case";

export const getAuction = (program: Command, container: Container) => {
  program
    .command("get-auction")
    .description("Get an auction")
    .option("-i, --id <id>", "Auction id")
    .action((options) => {
      const id = options.id || "";
      const useCase = createAuctionUseCase(
        container.repository,
        auctionService
      );

      const result = useCase.getById(id);

      if (result.isOk()) {
        console.log(result.value);
      } else {
        console.error(result.error);
      }
    });
};
