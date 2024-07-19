import { Request, Response, NextFunction } from 'express';
import { tokenGenerator, setTokenCookie } from '../utils/utils';
import  User  from '../model/userModel';
import  Note  from '../model/noteModel';

export const signUp = async(req: Request, res: Response, next: NextFunction) =>{
  const {fullName, email, gender, phone, address, password, confirm_password} = req.body

    const normalisedEmail = email.toLowerCase();
    const userExist = await User.findOne({where: {email: normalisedEmail}});
    if (userExist) return res.send('User already exist');
    try {
      const user = await User.create({
        fullName,
        email: normalisedEmail,
        gender,
        phone,
        address,
        password,
        confirm_password
      })
      if(user){
        const token = tokenGenerator((user as any)._id);
        setTokenCookie(res, token);
        return res.status(201).json({
          msg: 'user created successfully',
          user,
          token
        });
      }else{
        return res.status(400).json({
          msg: 'user not created',
        });
      }}catch (error: any) {
        return res.status(500).json({
          msg: error.message,
        });
      }
  }


  export const signIn = async(req: Request, res: Response, next: NextFunction) =>{
    const {email, password} = req.body
    const normalisedEmail = email.toLowerCase();
    const user = await User.findOne({email: normalisedEmail});
    if (!user) return res.send('User does not exist');
    try {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.send('Invalid password');
      const token = tokenGenerator((user as any)._id);
      setTokenCookie(res, token);
      return res.status(200).json({
        msg: 'user logged in successfully',
        user,
        token
      });
    } catch (error: any) {
      return res.status(500).json({
        msg: error.message,
      });
    } 
  }

  export const signOut = async(req: Request, res: Response, next: NextFunction) =>{
    try{
      res.cookie('token', '', { maxAge: 1 });
      return res.status(200).json({
        msg: 'user logged out successfully',
      });
    }catch(error: any){
      return res.status(500).json({
        msg: error.message,
      });
    }
   
  }