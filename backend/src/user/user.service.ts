import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from './entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UserResponseInterface } from './types'
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto'
import * as argon from "argon2"

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwt: JwtService,
    private config: ConfigService
  ) { }
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const newUser = new UserEntity()
      Object.assign(newUser, createUserDto)

      return await this.userRepository.save(newUser)
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Credentials taken',
          HttpStatus.UNPROCESSABLE_ENTITY
        )
      }
      throw error
    }
  }

  async signIn(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user =
      await this.userRepository.findOne({
        where: {
          email: loginUserDto.email,
        },
        select: ['id', 'username', 'email', 'bio', 'image', 'password','createdAt', 'updatedAt']
      })

    if (!user) {
      throw new ForbiddenException('Credentials incorrect')
    }

    const pwMatches = await argon.verify(
      user.password,
      loginUserDto.password,
    )

    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect')
    }
    delete user.password
    return user
  }


  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    })
  }
  async findById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: id });
  }
  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }


  
  async buildResponse(user: UserEntity): Promise<UserResponseInterface> {
    return {
      user: {
        ...user,
        access_token: await this.signToken(user)
      }
    }
  }

  private async signToken(
    user: UserEntity,
  ): Promise<string> {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email
    }
    const secret = this.config.get('JWT_SECRET')
    return await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: secret,
      },
    )

  }
}
