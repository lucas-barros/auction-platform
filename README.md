# Auction Platform

## Overview

This project implements a set of features capable of creating auctions, accepting bids, and retrieving information about auctions.

This project was designed with clean architecture principles to create a modular and maintainable code base. This approach helps in keeping the core business logic independent of external frameworks and libraries, making it easier to test and evolve.

Two applications were made for the purpose of validating the isolation of business logic. A rest API and a CLI.

## Installation

To set up the Auction Platform, follow these steps:

1. Install dependencies:

`npm install`

2. Build the project:

`npm run build`

## Usage

### Starting the Server

To start the server, use the following command:

`npm run start`

### Starting the CLI

To start the server, use the following command:

`npm run start:cli`

This will run the compiled application located at `dist/index.js`.

### Development Mode

During development, you can use the following command to run the server in watch mode:

`npm run dev`

This uses `ts-node-dev` to automatically restart the server when changes are detected.

### Testing

Run unit tests using the following command:

`npm run test:unit`

Run e2e tests using the following command:

`npm run test:e2e`


## Project Structure

- `src`: Contains the source code of the application.
  - `apps`: Application layer.
    - `controllers`: Request handlers.
    - `middlewares`: Middleware functions.
    - `routes`: Application routes.
  - `domain`: Domain layer.
    - `entities`: Business entities.
    - `exceptions`: Custom exceptions.
    - `repositories`: Data access interfaces.
    - `services`: Business logic services.
    - `use-cases`: Application use cases.
  - `infrastructure`: Infrastructure layer.
    - `database`: Database-related components.
      - `in-memory`: In-memory database implementation.
