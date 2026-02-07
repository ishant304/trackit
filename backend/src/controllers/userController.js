import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import User from "../models/userSchema.js";


export const registerUser = async (req, resp) => {

    const body = req.body;
    const { username, name, password } = body

    if (!body.username || !body.name || !body.password) {
        return resp.status(400).json({ "msg": "Please fill all the fields" })
    }
    const hashedPass = await bcrypt.hash(body.password, 10)

    const userData = {
        username,
        name,
        password: hashedPass
    }

    const existingUser = await User.findOne({ username })

    if (existingUser) {
        return resp.status(409).json({ "msg": "Username already exist" })
    }

    const savedUser = await User.create(userData)

    return resp.status(201).json({
        msg: "User registered successfully",
        userId: savedUser._id
    })

}

export const loginUser = async (req, resp) => {

    const body = req.body
    const { username, password } = body

    if (!body.username || !body.password) {
        return resp.status(400).json({ "msg": "Please fill all the fields" })
    }

    const existingUser = await User.findOne({ username })

    if (!existingUser) {
        return resp.status(401).json({ "msg": "username or password is incorrect" })
    }

    const isMatch = await bcrypt.compare(
        password, existingUser.password
    )

    if (!isMatch) {
        return resp.status(401).json({ "msg": "username or password incorrect" })
    }

    const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET ,
        { expiresIn: "7d" }
    )

    resp.cookie("jwt", token, {
        httpOnly: true,   
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    console.log(token)

    return resp.status(200).json({ "msg": "loged in successfully" })

}

export const getProfile = (req,resp)=>{

    console.log(req.user.username)
    return resp.status(200).json({"user": req.user})

}

export const logoutUser = (req, resp)=>{

    resp.clearCookie("jwt",{
        httpOnly : true
    })

    return resp.status(200).json({"msg":"logged out successfully"})

}