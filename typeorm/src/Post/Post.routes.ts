// src/Post/Post.routes.ts
import { Router } from 'express';
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from './Post.controller';

const router = Router();

router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/:id', (req, res, next) => {
    getPostById(req, res).catch(next);
});
router.put('/:id', (req, res, next) => {
    updatePost(req, res).catch(next);
});
router.delete('/:id', deletePost);

export default router;

