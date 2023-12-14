import express from "express";
import swaggerUi from "swagger-ui-express";
import * as YAML from "yamljs";
import { auctionRouter } from "./src/app/routes/auction.route";

const swaggerDocument = YAML.load("./api-spec.yaml");

const port = 3000;

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auctions", auctionRouter);

export const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
