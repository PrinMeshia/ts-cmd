import { UserEntity } from '@app/user/entities/user.entity'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, DeleteResult, Repository } from 'typeorm'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { ArticleEntity } from './entities/article.entity'
import { ArticleResponseInterface } from './types/articleResponse.interface'
import slugify from 'slugify'
import { ArticlesResponseInterface } from './types/articlesResponse.interface'

@Injectable()
export class ArticleService {


  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private datasource: DataSource
  ) { }
  async create(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = new ArticleEntity()

    Object.assign(article, createArticleDto)
    if (!article.tags) article.tags = []
    article.author = currentUser

    article.slug = this.getSlug(createArticleDto.title)
    return await this.articleRepository.save(article)
  }

  async findAll(userId: string, query: any): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.datasource.getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')

    if (query.tag) {
      queryBuilder.andWhere('article.tags LIKE :tag', {
        tag: `%${query.tag}%`
      })
    }
    if (query.author) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.author
        }
      })
      queryBuilder.andWhere('article.authorId LIKE :id', {
        id: author?.id
      })
    }
    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.favorited
        },
        relations: ['favorites']
      })
      const ids = author?.favorites.map((el) => el.id)
      if (ids?.length > 0) {
        queryBuilder.andWhere('article.authorId In (:...ids)', { ids })
      } else {
        queryBuilder.andWhere('1=0')
      }

    }

    queryBuilder.orderBy('article.createdAt', 'DESC')

    const articlesCount = await queryBuilder.getCount()

    if (query.limit)
      queryBuilder.limit(query.limit)

    if (query.offset)
      queryBuilder.offset(query.offset)

    let favoriteIds: string[] = [];

    if (userId) {
      const currentUser = await this.userRepository.findOneOrFail({
        where: { id: userId },
        relations: ["favorites"]
      });

      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany()
    const articlesWithFavorited = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });

    return { articles: articlesWithFavorited, articlesCount };
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOneBy({ slug: slug } as any)
  }
  async findById(id: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOneBy({ id: id })
  }

  async update(userId: string, id: string, updateArticleDto: UpdateArticleDto): Promise<ArticleEntity> {
    const article = await this.findById(id)
    if (!article)
      throw new NotFoundException(`Article ${id} not found`)

    if (article.author.id !== userId)
      throw new ForbiddenException(`You are not an author`)

    Object.assign(article, UpdateArticleDto)
    if (!article.tags) article.tags = []

    article.slug = this.getSlug(updateArticleDto.title)
    return await this.articleRepository.save(article)
  }

  async remove(id: string, userId: string): Promise<DeleteResult> {
    const article = await this.findById(id)
    if (!article)
      throw new NotFoundException(`Article ${id} not found`)

    if (article.author.id !== userId)
      throw new ForbiddenException(`You are not an author`)

    return await this.articleRepository.delete(id)
  }

  async updateArticleToFavorites(id: string, userId: string): Promise<ArticleEntity> {
    const article: ArticleEntity = await this.findById(id)
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites']
    })
    const articleindex = user.favorites.findIndex(articleInFavorite => articleInFavorite.id === article.id)

    if (articleindex >= 0) {
      user.favorites.splice(articleindex, 1)
      article.favoritesCount--
    } else {
      user.favorites.push(article)
      article.favoritesCount++
    }

    await this.userRepository.save(user)
    await this.articleRepository.save(article)

    return article
  }


  async buildResponse(article: ArticleEntity): Promise<ArticleResponseInterface> {
    return { article }
  }

  private getSlug(title: string): string {
    return slugify(title, {}) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
  }
}
