const router = require("express").Router();
const {verify,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('../middlewares/verifyToken')
const {updateUser, blockUser, unblock, getUser, follow, unfollow, deleteUser, getAllUsers} = require('../controllers/userController')

//update user
router.put("/:id",verifyTokenAndAuthorization,updateUser);

//block user
router.put("/block/:id",verifyTokenAndAdmin,blockUser);

//unblock user
router.put("/unblock/:id",verifyTokenAndAdmin,unblock);

//get a user
router.get("/:id",getUser);

//get all users
router.get("/",verifyTokenAndAdmin,getAllUsers);

//follow a user
router.put("/:id/follow", verify,follow);

//unfollow  user

router.put("/:id/unfollow", verify,unfollow);

//delete user
router.delete("/:id", verifyTokenAndAuthorization,deleteUser);
  
module.exports = router;
