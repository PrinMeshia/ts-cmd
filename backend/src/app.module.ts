import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import ormConfig from './config/orm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env']
    }),
    TypeOrmModule.forRoot(ormConfig), 
    TagModule, 
    UserModule, AuthModule, ArticleModule, CommentModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}

