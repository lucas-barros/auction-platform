import { Request, Response } from "express";
import { AuctionUseCase } from "../../domain/use-cases/auction.case";
import { AuctionException } from "../../domain/exceptions/auction.exception";
import {
  AuctionParamsDTO,
  AuctionResponseDTO,
  CreateAuctionRequestDTO,
  CreateAuctionResponseDTO,
  PlaceBidParamsDTO,
  PlaceBidRequestDTO,
  PlaceBidResponseDTO,
} from "../dtos/auction.dto";

const INTERNAL_ERROR = "Internal server error";

export interface AuctionController {
  create(
    req: Request<{}, {}, CreateAuctionRequestDTO>,
    res: Response<CreateAuctionResponseDTO>
  ): void;

  placeBid(
    req: Request<PlaceBidParamsDTO, {}, PlaceBidRequestDTO>,
    res: Response<PlaceBidResponseDTO>
  ): void;

  getById(
    req: Request<AuctionParamsDTO>,
    res: Response<AuctionResponseDTO>
  ): void;
}

export const createAuctionController = (
  useCase: AuctionUseCase
): AuctionController => {
  return {
    create: (req, res) => {
      const { title, endTime } = req.body;
      const result = useCase.create({ title, endTime });

      if (result.isOk()) {
        res.status(201).json({ id: result.value });
        return;
      }
      if (result.error === AuctionException.InvalidData) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.status(500).json({ error: INTERNAL_ERROR });
    },

    placeBid: (req, res) => {
      const auctionId = req.params.id;
      const { username } = res.locals;
      const { value } = req.body;
      const result = useCase.placeBid({ username, auctionId, value });

      if (result.isOk()) {
        res.status(201).json();
        return;
      }
      if (result.error === AuctionException.NotFound) {
        res.status(404).json({ error: result.error });
        return;
      }
      if (
        result.error === AuctionException.InvalidData ||
        result.error === AuctionException.AuctionEnded
      ) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.status(500).json({ error: INTERNAL_ERROR });
    },

    getById: (req, res) => {
      const auctionId = req.params.id;
      const result = useCase.getById(auctionId);

      if (result.isOk()) {
        res.status(200).json(result.value);
        return;
      }
      if (result.error === AuctionException.NotFound) {
        res.status(404).json({ error: result.error });
        return;
      }
      if (result.error === AuctionException.InvalidData) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.status(500).json({ error: INTERNAL_ERROR });
    },
  };
};
