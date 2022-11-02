const router = require("express").Router();
const { register, userLogin, adminLogin } = require("../controllers/authController");


//REGISTER
router.post("/register",register);

//LOGIN
router.post("/login",userLogin);

//admin login
router.post("/admin-login",adminLogin);

module.exports = router;