const User = require("../models/User");
const Report = require("../models/Reports");
const bcrypt = require("bcrypt");
const NotificationModel = require("../models/Notification")
exports.updateUser = async (req, res) => {

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
}

exports.blockUser=async (req, res) => {

  try {
    await User.findByIdAndUpdate(req.params.id, {
      $set: {blocked:true},
    });
    res.status(200).json("Account blocked successfully");

  } catch (err) {
    return res.status(500).json(err);
  }

}

exports.unblock=async (req, res) => {

  try {
    await User.findByIdAndUpdate(req.params.id, {
      $set: {blocked:false},
    });
    res.status(200).json("Account unblocked successfully");

  } catch (err) {
    return res.status(500).json(err);
  }

} 

exports.getUser=async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.getAllUsers=async (req, res) => {
  try {
    const user = await User.find({},{password:0});
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.getUserStats=async (req, res) => {
 
  const today = new Date();
  const latYear = today.setFullYear(today.setFullYear() - 1);

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
    console.log(data);
  } catch (err) {
    res.status(500).json(err);
  }
}

exports.follow=async (req, res) => {
  if (req.user.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
      if (!user.followers.includes(req.user.id)) {
        await user.updateOne({ $push: { followers: req.user.id } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        await NotificationModel.create({
          userId: req.params.id,
          emiterId:req.body.userId,
          text:"started following you"
      }).then(()=>{
          res.status(200).json("user has been followed");
      })
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
}

exports.unfollow=async (req, res) => {
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
}

exports.deleteUser=async (req, res) => {
    
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Account has been deleted");
  } catch (err) {
    return res.status(500).json(err);
  }

}

exports.getFriends=async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      if (friend!=null) {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      }
     
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
}

exports.reportUser=async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    req.body.userId = req.user.id
    req.body.name = req.user?.email
    req.body.postId = user._id
    req.body.post=user?.profilePicture
    req.body.desc=user.desc
    req.body.type="user"
    if (user.reports.filter(e => e === req.user.id).length <= 0) {
      /* vendors contains the element we're looking for */
      await user.updateOne({ $push: { reports: req.user.id} });
      const newReport = new Report(req.body);
      const savedReport = await newReport.save();

      res.status(200).json(savedReport);
    } else {
      res.status(403).json("you already reported this user");
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }

}

exports.rejectReport=async (req, res) => {
  try {
    console.log(req.query.name,"test");
    var isPostFound=true
    const user = await User.findById(req.params.id);

    // const report = await Report.findById(req.query.id)
    if (!user) {
      res.status(403).json("user not found");
      isPostFound = false
    }
    if (req.user.isAdmin) {
      await user.updateOne({ $pull: { reports: req.query.name} })
      await Report.deleteMany({_id:req.query.id})
      res.status(200).json("report removed");
    } else {
      res.status(403).json("authorization failed");
    }
  } catch (err) {
    if (isPostFound) {
      res.status(500).json(err);
    }
    console.log(err);
  }
}

exports.resolveReport=async (req, res) => {
  try {
    var isPostFound=true
    const user = await User.findById(req.params.id);
    // const report = await Report.findById(req.query.id)
    if (!user) {
      res.status(403).json("user not found");
      isPostFound = false
    }
    if (req.user.isAdmin) {
      await user.updateOne({ blocked:true})
      await Report.deleteMany({_id:req.query.id})
      res.status(200).json("report resolved");
    } else {
      res.status(403).json("authorization failed");
    }
  } catch (err) {
    if (isPostFound) {
      res.status(500).json(err);
    }
    console.log(err);
  }
}