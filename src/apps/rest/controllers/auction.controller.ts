import { Request, Response } from "express";
import { AuctionUseCase } from "../../../domain/use-cases/auction.case";
import { AuctionException } from "../../../domain/exceptions/auction.exception";
import {
  AuctionView,
  CreateAuctionView,
  GetByIdView,
  PlaceBidView,
} from "../views/auction.view";
import {
  CreateAuctionRequest,
  PlaceBidParams,
  PlaceBidRequest,
  AuctionParams,
} from "../dtos/auction.dto";

const INTERNAL_ERROR = "Internal server error";

export interface AuctionController {
  create(
    req: Request<{}, {}, CreateAuctionRequest>,
    res: Response<CreateAuctionView>
  ): void;

  placeBid(
    req: Request<PlaceBidParams, {}, PlaceBidRequest>,
    res: Response<PlaceBidView>
  ): void;

  getById(req: Request<AuctionParams>, res: Response<GetByIdView>): void;
}

export const createAuctionController = (
  useCase: AuctionUseCase,
  view: AuctionView
): AuctionController => {
  return {
    create: (req, res) => {
      const { title, endTime } = req.body;
      const result = useCase.create({ title, endTime });

      if (result.isOk()) {
        res.status(201).send(view.create(result.value));
        return;
      }
      if (result.error === AuctionException.InvalidData) {
        res.status(400).send(view.error(result.error));
        return;
      }
      res.status(500).send(view.error(INTERNAL_ERROR));
    },

    placeBid: (req, res) => {
      const auctionId = req.params.id;
      const { username } = res.locals;
      const { value } = req.body;
      const result = useCase.placeBid({ username, auctionId, value });

      if (result.isOk()) {
        res.status(201).send();
        return;
      }
      if (result.error === AuctionException.NotFound) {
        res.status(404).send(view.error(result.error));
        return;
      }
      if (
        result.error === AuctionException.InvalidData ||
        result.error === AuctionException.AuctionEnded
      ) {
        res.status(400).send(view.error(result.error));
        return;
      }
      res.status(500).send(view.error(INTERNAL_ERROR));
    },

    getById: (req, res) => {
      const auctionId = req.params.id;
      const result = useCase.getById(auctionId);

      if (result.isOk()) {
        res.status(200).send(view.getById(result.value));
        return;
      }
      if (result.error === AuctionException.NotFound) {
        res.status(404).send(view.error(result.error));
        return;
      }
      if (result.error === AuctionException.InvalidData) {
        res.status(400).send(view.error(result.error));
        return;
      }
      res.status(500).send(view.error(INTERNAL_ERROR));
    },
  };
};
