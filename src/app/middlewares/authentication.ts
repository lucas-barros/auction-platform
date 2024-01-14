import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../domain/repositories/user.repository";

export const FAILED_AUTHENTICATION = "Failed Authentication";

export interface AuthenticationMiddleware {
  basicAuthMiddleware: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
}

export const createAuthenticationMiddleware = (
  userRepository: UserRepository
): AuthenticationMiddleware => {
  return {
    basicAuthMiddleware: (req, res, next) => {
      const { authorization } = req.headers;

      if (authorization === undefined) {
        return res.status(401).json({ error: FAILED_AUTHENTICATION });
      }

      const base64Credentials = authorization.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "ascii"
      );
      const [username, password] = credentials.split(":");

      const result = userRepository.geByUsername(username);

      if (result?.password !== password) {
        return res.status(401).json({ error: FAILED_AUTHENTICATION });
      }

      res.locals.username = result.username;
      res.locals.permissions = result.permissions;
      next();
    },
  };
};
