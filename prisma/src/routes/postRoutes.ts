import { Router } from 'express';
import { createPost, getPosts, updatePost, deletePost } from '../controllers/postController';

const router = Router();

router.post('/', createPost);
router.get('/', getPosts);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
