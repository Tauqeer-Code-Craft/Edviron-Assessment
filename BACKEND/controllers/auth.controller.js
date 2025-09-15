const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register =   async (req, res) => {
    try{
        const { username, password } = req.body;
        const hashed = await bcrypt.hash(password,10);
        const user = await User.create({ username, password: hashed });

        res.status(201).json({ message: "User registered successfully",
            user: { id: user._id, username: user.username}
         });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}

const login = async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user) return res.status(400).json({ message: "User not Found" });

        const valid = await bcrypt.compare(password, user.password);
        if(!valid) return res.status(400).json({ message: "Invalid Credentials" });

        const token  = jwt.sign({ id: user._id }, process.env.JWT_SECRET , { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000, // 1 hour
        });
        res.json({ message: "Login successful", token });
    }
    catch(err){
         res.status(500).json({ error: "Server error" });
    }
}

const me = async (req,res) =>{
    try{
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
    }   
    catch(err){
    res.status(500).json({ message: "Server error" });
    }
};

const logout = async (req, res) => {
    try{
        res.clearCookie("token",{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.json({ message: "Logged out Successfully"});
    }
    catch(err){
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { register, login, me, logout };