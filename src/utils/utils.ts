import  Jwt  from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export const tokenGenerator = (id: string) => {
  const jwtsecret = process.env.JWT_SECRET as string;
  const token = Jwt.sign({ id }, jwtsecret, { expiresIn: '1d' });
  return token;
}

export const setTokenCookie = (res: Response, token: string) => {
  res.setHeader('Set-Cookie', `token=${token}; path=/; HttpOnly`);
}


