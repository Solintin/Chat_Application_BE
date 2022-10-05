const e = require("express");
const express = require("express");
const Post = require("../Models/post");
const User = require("../Models/user");
const router = express.Router();

//Create a post
router.post("/", async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    return res
      .status(201)
      .json({ message: "Post created successfully", data: newPost });
  } catch (error) {
    return res.status(200).json({ message: error });
  }
});

//update a post
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = await Post.findById({ _id: id });
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }

  if (post.userId == userId) {
    try {
      const updatedPost = await Post.findByIdAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res
        .status(201)
        .json({ message: "Post updated successfully", data: updatedPost });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  } else {
    return res.status(403).json({ message: "You cannot update this post" });
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = await Post.findById({ _id: id });

  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  if (post.userId == userId) {
    try {
      await Post.findByIdAndDelete({ _id: id });
      return res.status(201).json({ message: "Post deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  } else {
    return res.status(403).json({ message: "You cannot delete this post" });
  }
});

//delete a post
router.put("/:id/like", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = await Post.findById({ _id: id });

  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  try {
    if (!post.likes.includes(userId)) {
      //Like a post

      await Post.findByIdAndUpdate(
        { _id: id },
        {
          $push: { likes: userId },
        }
      );
      return res.status(200).json({ message: "Post Liked successfully" });
    } else {
      await Post.findByIdAndUpdate(
        { _id: id },
        {
          $pull: { likes: userId },
        }
      );
      return res.status(200).json({ message: "Post UnLiked successfully" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

//get a post
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById({ _id: id });
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    return res
      .status(200)
      .json({ message: "Post retrieved successfully", data: post });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

//Get timelines post
router.get("/timeline/all", async (req, res) => {
  const { userId } = req.body;
  console.log(userId);

  try {
  const currentUser = await User.findById({ _id: userId });
  const currentUserPosts = await Post.find({ userId: currentUser._id });
  
  // const friendPosts = await Post.find({ userId: currentUser.followings[0] });
  
  const friendPosts = await Promise.all(
    currentUser.followings.map((friendId) => {
      return Post.find({ userId: friendId });
    })
    );
    const allPosts = currentUserPosts.concat(...friendPosts);
    return res
      .status(200)
      .json({ message: "Posts retrieved successfully", data: allPosts });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

module.exports = router;
