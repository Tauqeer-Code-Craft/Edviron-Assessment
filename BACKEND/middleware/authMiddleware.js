const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next){

    const authHeader = req.headers.authorization;


    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if(!token){
        return res.status(401).json({ message: "Authorization token missing" });
    }

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    }
    catch(err){
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = authMiddleware;