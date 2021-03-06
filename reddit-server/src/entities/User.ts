import { Post } from './Post';
import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ unique: true })
    userName!: string;

    @Field(() => String)
    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @OneToMany(() => Post, (post) => post.creator)
    posts: Post[];

    @Field(() => String)
    @CreateDateColumn({ type: 'date' })
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt = Date;

}