const Comment = require('../models/Comment');
const Post = require('../models/Post');

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(comment);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }
    res.status(500).json({ error: error.message });
  }
};

const getCommentsByPostId = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.json(comments);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    res.status(500).json({ error: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const { content, sender, postId } = req.body;
    
    if (!content || !sender || !postId) {
      return res.status(400).json({ error: 'Content, sender, and postId are required' });
    }
    
    if (typeof postId === 'string' && postId.trim() === '') {
      return res.status(400).json({ error: 'Post ID cannot be empty' });
    }
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const comment = new Comment({ content, sender, postId });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }
    res.status(500).json({ error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { content, sender, postId } = req.body;
    
    if (content !== undefined && !content.trim()) {
      return res.status(400).json({ error: 'Content cannot be empty' });
    }
    if (sender !== undefined && !sender.trim()) {
      return res.status(400).json({ error: 'Sender cannot be empty' });
    }
    
    if (postId !== undefined) {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
    }
    
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(comment);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid comment ID or post ID' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllComments,
  getCommentById,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment
};