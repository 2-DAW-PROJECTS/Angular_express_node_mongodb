// src/userAdmin/userEnterprise.entity.ts
import { Entity, ObjectIdColumn, ObjectId, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('UserEnterprise')
export class UserEnterprise {
    @ObjectIdColumn()
    _id?: ObjectId;

    @Column()
    username!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column({ type: 'enum', enum: ['enterprise'], default: 'enterprise' })
    usertype!: 'enterprise';

    @Column({ default: true })
    isActive!: boolean;

    @Column("simple-array")
    permissions!: string[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

    @Column("simple-array")
    followers!: string[];

    @Column("simple-array")
    userEnterpriseIds!: string[];

    @Column({ type: 'string', nullable: true })
    logo?: string;

    @Column({ type: 'string', nullable: true })
    website?: string;

    @Column({ type: 'string', nullable: true })
    location?: string;

    @Column({ type: 'string', nullable: true })
    description?: string;

    @Column({ type: 'string', nullable: true })
    industry?: string;

    @Column({ type: 'string', nullable: true })
    telephone?: string;
}
