import { GetUser } from '@app/auth/decorators'
import { JwtGuard, OptionalJwtAuthGuard } from '@app/auth/guards'
import { UserEntity } from '@app/user/entities/user.entity'
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common'
import { DeleteResult } from 'typeorm'
import { ArticleService } from './article.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { ArticleResponseInterface } from './types/articleResponse.interface'
import { ArticlesResponseInterface } from './types/articlesResponse.interface'

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@GetUser() currentUser: UserEntity,  @Body('article') createArticleDto: CreateArticleDto): Promise<ArticleResponseInterface> {
    const article =  await this.articleService.create(currentUser,createArticleDto)
    return this.articleService.buildResponse(article)
  }
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(@GetUser() userId: string,@Query() query:any): Promise<ArticlesResponseInterface> {
    return this.articleService.findAll(userId,query)
  }

  @Get(':slug')
  async findOneBySlug(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug)
    return this.articleService.buildResponse(article)
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(@GetUser('id') userId: string,@Param('id') id: string, @Body('article') updateArticleDto: UpdateArticleDto) {
    const article = await this.articleService.update(userId, id, updateArticleDto)
    return this.articleService.buildResponse(article)
  }
  @UseGuards(JwtGuard)
  @Post(':id/favorite')
  async addFavorite(@GetUser('id') userId: string,@Param('id') id: string): Promise<ArticleResponseInterface>{
    return await this.updateFavorite(id,userId)
  }

  @UseGuards(JwtGuard)
  @Delete(':id/favorite')
  async deleteFavorite(@GetUser('id') userId: string,@Param('id') id: string): Promise<ArticleResponseInterface>{
    return await this.updateFavorite(id,userId)
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@GetUser('id') userId: string,@Param('id') id: string):Promise<DeleteResult> {
    return await this.articleService.remove(id,userId)
  }

  private async updateFavorite(articleId : string,userId:string): Promise<ArticleResponseInterface>{
    const article = await this.articleService.updateArticleToFavorites(articleId,userId)
    return this.articleService.buildResponse(article)
  }
}
