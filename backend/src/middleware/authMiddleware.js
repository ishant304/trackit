import jwt from "jsonwebtoken"
import User from "../models/userSchema.js";

const protect = async (req, resp, next)=>{

    try{

        const token = req.cookies.jwt;

        if(!token){
            return resp.status(401).json({"msg": "User is not authorised! No token found"})
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decodedUser.id).select("-password");

        if(!req.user){
            return resp.status(401).json({"msg":"User not found"})
        }

        next();
    
    }
    catch(err){

        return resp.status(401).json({"msg":"Not authorized, Token failed"})

    }

}

export default protect;