/// <reference types="jest" />

export interface JwtUser {
  id: string;
  username: string;
  password: string;
  about: string;
  balance: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}
