import express, { NextFunction, Request, Response } from 'express';
import  jwt  from 'jsonwebtoken';
import User from '../model/userModel';

export const authentification = async (req: Request, res: Response, next: NextFunction) => {
  try{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1];
    }else if(req.cookies.token){
      token = req.cookies.token;
    }if(!token){
      return res.status(401).json({msg: 'You are not authorized to access this route'});
    } 
    const decoded = await jwt.verify(token, process.env.JWT_SECRET as string) as { id : string};
    req.userId = decoded.id;
    console.log(decoded);
    console.log(req.userId);
    console.log(decoded.userId);
    console.log("........")
    next();
  }catch(error){
    return res.status(401).json({msg: 'You are not authorized to access this route'});
  }
}