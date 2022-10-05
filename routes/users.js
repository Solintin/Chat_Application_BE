const express = require("express");
const router = express.Router();
const User = require("../Models/user");

//update a user
router.put("/:id", async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  const user = await User.findById({ _id: id });

  if (user) {
    if (password) {
      user.password = password;
      await user.save();
    }
    try {
      const user = await User.findByIdAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res
        .status(200)
        .json({ message: "User updated successfully", data: user });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  } else {
    return res.status(403).json({ error: "Access denied" });
  }
});

//delete a user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById({ _id: id });

  if (user) {
    try {
      await User.findByIdAndDelete({ _id: id });
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  } else {
    return res.status(403).json({ error: "Access denied" });
  }
});

//get  a user
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById({ _id: id });
  const { password, createdAt, updatedAt, ...otherUserData } = user._doc;

  if (user) {
    return res
      .status(200)
      .json({ message: "User retrieved successfully", data: otherUserData });
  } else {
    return res.status(404).json({ error: "No user found" });
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  const { id } = req.params;
  const { userToFollowId } = req.body;
  const currentUser = await User.findById({ _id: id });
  const userToFollow = await User.findById({ _id: userToFollowId });

  if (id === userToFollowId) {
    return res.status(403).json({ error: "You can't follow yourself" });
  } else {
    try {
      if (!userToFollow._doc.followers.includes(id)) {
        //Method 1 - update userToFollow

        userToFollow.followers.push(id);
        userToFollow.save();
        
        
        // Method 2 - update currrentUser followers
        await User.findByIdAndUpdate(
          { _id: id },
          {
            $push: { followings: userToFollowId },
          }
        );
        return res.status(200).json({ message: "User followed successfully" });
      } else {
        return res
          .status(403)
          .json({ message: "You're already a follower of this user" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
});




//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  const { id } = req.params;
  const { userToUnFollowId } = req.body;
  const currentUser = await User.findById({ _id: id });
  const userToUnFollow = await User.findById({ _id: userToUnFollowId });

  if (id === userToUnFollowId) {
    return res.status(403).json({ error: "You can't unfollow yourself" });
  } else {
    try {
      if (userToUnFollow.followers.includes(id)) {
        //Method 1 - update userToUnFollow
        await User.findByIdAndUpdate(
          { _id: userToUnFollowId },
          {
            $pull: { followers: id },
          }
        );
        
        
        // Method 2 - update currrentUser unfollowers
        await User.findByIdAndUpdate(
          { _id: id },
          {
            $pull: { followings: userToUnFollowId },
          }
        );
        return res.status(200).json({ message: "User unfollowed successfully" });
      } else {
        return res
          .status(403)
          .json({ message: "You're not a follower this user" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
});

module.exports = router;
