import express from "express";
import swaggerUi from "swagger-ui-express";
import * as YAML from "yamljs";
import { router as auctionRouter } from "./src/apps/rest/routes/auction.route";
import { createContainer } from "./src/domain/container";
import { inMemoryDatabaseClient } from "./src/infrastructure/database/in-memory/client";
import { auctionJsonView, auctionHtmlView } from "./src/apps/rest/views/auction.view";

const swaggerDocument = YAML.load("./api-spec.yaml");

const port = 3000;

const app = express();

const container = createContainer(inMemoryDatabaseClient);

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auctions", auctionRouter(container, auctionJsonView));

app.use("/html/auctions", auctionRouter(container, auctionHtmlView));

export const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
