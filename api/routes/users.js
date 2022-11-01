const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const {verify,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('../verifyToken')
//update user
router.put("/:id",verifyTokenAndAuthorization,async (req, res) => {

    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
});

//block user
router.put("/block/:id",verifyTokenAndAdmin, async (req, res) => {

    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: {blocked:true},
      });
      res.status(200).json("Account blocked successfully");

    } catch (err) {
      return res.status(500).json(err);
    }
  
});
//unblock user
router.put("/unblock/:id",verifyTokenAndAdmin, async (req, res) => {

  try {
    await User.findByIdAndUpdate(req.params.id, {
      $set: {blocked:false},
    });
    res.status(200).json("Account unblocked successfully");

  } catch (err) {
    return res.status(500).json(err);
  }

});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user

router.put("/:id/follow", verify,async (req, res) => {
  if (req.user.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
      if (!user.followers.includes(req.user.id)) {
        await user.updateOne({ $push: { followers: req.user.id } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow  user

router.put("/:id/unfollow", verify,async (req, res) => {
    if (req.user.id !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);
        if (user.followers.includes(req.user.id)) {
          await user.updateOne({ $pull: { followers: req.user.id } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you are not following this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });
  router.delete("/:id", verifyTokenAndAuthorization,async (req, res) => {
    
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
  
  });
  
module.exports = router;
