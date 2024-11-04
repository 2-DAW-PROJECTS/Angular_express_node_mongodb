// src/userAdmin/userAdmin.entity.ts
import { Entity, ObjectIdColumn, ObjectId, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('userAdmin')
export class UserAdmin {
    @ObjectIdColumn()
    _id?: ObjectId;

    @Column({
        type: 'enum',
        enum: ['Admin', 'SuperAdmin'],
        default: 'Admin'
    })
    userType!: 'Admin' | 'SuperAdmin';

    @Column({ default: true })
    isActive!: boolean;

    @Column()
    email!: string;

    @Column("simple-array")
    permissions!: string[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

    @Column("simple-array")
    userEnterpriseIds!: string[];

    @Column()
    username!: string;

    @Column()
    password!: string;
}//@entity
