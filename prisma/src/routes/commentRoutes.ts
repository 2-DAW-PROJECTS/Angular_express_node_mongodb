import { Router } from 'express';
import { createComment, getCommentsByPost, deleteComment } from '../controllers/commentController';

const router = Router();

router.post('/', createComment);
router.get('/post/:postId', getCommentsByPost);
router.delete('/:id', deleteComment);

export default router;
