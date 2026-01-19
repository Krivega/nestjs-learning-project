/// <reference types="jest" />

export interface JwtUser {
  userId: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}
