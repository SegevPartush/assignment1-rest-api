const express = require('express');
const router = express.Router();
const {
  getAllComments,
  getCommentById,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

router.get('/', getAllComments);
router.get('/:id', getCommentById);
router.get('/post/:postId', getCommentsByPostId);
router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;