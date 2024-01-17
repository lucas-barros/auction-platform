import { Command } from "@commander-js/extra-typings";
import { Container } from "../../../domain/container";
import { auctionService } from "../../../domain/services/auction.service";
import { createAuctionUseCase } from "../../../domain/use-cases/auction.case";

export const createAuction = (program: Command, container: Container) => {
  program
    .command("create-auction")
    .description("Create an auction")
    .option("-t, --title <title>", "Auction title")
    .option("-e, --end <endTime>", "Auction end time")
    .action((options) => {
      const title = options.title ?? "Auction";
      const endTime = options.end ?? Date();
      const useCase = createAuctionUseCase(
        container.repository,
        auctionService
      );

      const result = useCase.create({ title, endTime });

      if (result.isOk()) {
        console.log(result.value);
      } else {
        console.error(result.error);
      }
    });
};
