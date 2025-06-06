import jwt from 'jsonwebtoken'
import { userModel } from "../models/userModel.js";


const authUser = async (req,res,next) =>{
  
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.json({success:false,message:"Not authorized! Login again"})
    }

    try {
        const token_decode = jwt.verify(token,process.env.JWT_SECRET_KEY)
        const user = await userModel.findById(token_decode.id);

        req.user = user;
        next();
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export default authUser