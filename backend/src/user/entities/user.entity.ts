import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import * as argon from 'argon2';
import { ArticleEntity } from '@app/article/entities/article.entity';
import { BaseEntity } from '@app/shared/entities/baseEntity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity{
  
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @Column({select: false })
  password: string;

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[]

  @ManyToMany(() => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon.hash(this.password)
  }

}
