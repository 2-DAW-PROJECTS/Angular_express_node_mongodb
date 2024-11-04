// src/Post/Post.entity.ts
import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('Post')
export class Post {
    @ObjectIdColumn()
    _id?: ObjectId;

    @Column()
    title!: string;

    @Column()
    content!: string;
}//@entity
