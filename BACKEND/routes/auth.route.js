const router = require("express").Router();
const { register, login, me, logout } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", authMiddleware , me);

module.exports = router;