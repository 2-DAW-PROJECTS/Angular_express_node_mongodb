// src/Post/Post.service.ts
import { AppDataSource } from '../config/database';
import { Post } from './post.entity';
import { ObjectId } from 'mongodb';

export class PostService {
    private postRepository = AppDataSource.getRepository(Post);

    async createPost(postData: Partial<Post>): Promise<Post> {
        const post = this.postRepository.create(postData);
        return await this.postRepository.save(post);
    }//createPost

    async getAllPosts(): Promise<Post[]> {
        return await this.postRepository.find();
    }//getAllPosts

    async getPostById(id: string): Promise<Post | null> {
        const objectId = new ObjectId(id);
        const result = await this.postRepository.findOne({ where: { _id: objectId } });
        return result;
    }//getPostById

    async updatePost(id: string, postData: Partial<Post>): Promise<Post | null> {
        await this.postRepository.update(id, postData);
        return this.getPostById(id);
    }//updatePost

    async deletePost(id: string): Promise<void> {
        await this.postRepository.delete(id);
    }//deletePost
}//class
