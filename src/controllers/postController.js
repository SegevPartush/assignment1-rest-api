const Post = require('../models/Post');

const getAllPosts = async (req, res) => {
  try {
    const { sender } = req.query;
    let query = {};
    if (sender) {
      query.sender = sender;
    }
    const posts = await Post.find(query);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    res.status(500).json({ error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, sender } = req.body;
    if (!title || !content || !sender) {
      return res.status(400).json({ error: 'Title, content, and sender are required' });
    }
    const post = new Post({ title, content, sender });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, sender } = req.body;
    
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    if (content !== undefined && !content.trim()) {
      return res.status(400).json({ error: 'Content cannot be empty' });
    }
    if (sender !== undefined && !sender.trim()) {
      return res.status(400).json({ error: 'Sender cannot be empty' });
    }
    
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
