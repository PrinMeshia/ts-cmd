import { BaseEntity } from "@app/shared/entities/baseEntity";
import { UserEntity } from "@app/user/entities/user.entity";
import {  BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: 'articles' })
export class ArticleEntity extends BaseEntity{
    @Column()
    slug: String

    @Column()
    title: String

    @Column({default: ''})
    description: String

    @Column({default: ''})
    body:string

    @Column('simple-array')
    tags: string[]

    @Column({default: 0})
    favoritesCount: number

    @ManyToOne(() =>UserEntity, (user) => user.articles, {eager:true})
    author: UserEntity
}
