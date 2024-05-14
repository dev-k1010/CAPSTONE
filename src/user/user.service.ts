import { HttpException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { config } from 'src/config/config';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {

  constructor(
    private config: config,
  ) { }

  prisma = new PrismaClient

  // Info user
  async infoUser(user_id: number) {
    let data = await this.prisma.users.findFirst({
      where: {
        user_id
      }
    })

    return data
  }

  // Update user
  async updateUser(body) {
    let { user_id,
      user_email,
      user_password,
      user_name,
      user_age,
      user_avatar, } = body

    if (!await this.prisma.users.findFirst({
      where: {
        user_id
      }
    })) {
      throw new HttpException("User_id no exits", 400)
    }
    await this.prisma.users.update({
      where: {
        user_id
      },
      data: {
        user_email,
        user_password,
        user_name,
        user_age,
        user_avatar
      }
    })
    throw new HttpException("Update success", 200)
  }

  // Sign Up
  async signUp(body: any) {

    let { user_email, user_password, user_name, user_age } = body

    //  Check email
    let existingUser = await this.config.checkMail(user_email);

    if (existingUser) {

      throw new HttpException("Email already exits", 400)

    }

    let newData = {
      user_email,
      user_password: bcrypt.hashSync(user_password, 10),
      user_name,
      user_age
    }

    await this.prisma.users.create({ data: newData });
    throw new HttpException("Registration success", 200)
  }

  // Login 
  async login(body: any) {

    let { user_email, user_password } = body
    let existingUser = await this.config.checkMail(user_email);
    let checkPass = bcrypt.compareSync(user_password, existingUser.user_password)

    // Check email
    if (existingUser) {

      // Check password
      if (checkPass) {

        let key = new Date().getTime()
        let token = await this.config.createToken({
          user_email: existingUser.user_email,
          user_name: existingUser.user_name,
          user_age: existingUser.user_age,
          key
        })

        await this.prisma.users.update({
          where: {
            user_id: existingUser.user_id
          },
          data: {
            refresh_token: token
          }
        });
        throw new HttpException("Login success", 200)
      }
      throw new HttpException("Password incorrect", 400)

    }
    throw new HttpException("Email incorrect", 400)

  }

  // Like
  async likeImg(body: { user_id: number, img_id: number, emotion_id: number }) {

    let { user_id, img_id, emotion_id } = body;
    let user = await this.prisma.users.findFirst({
      where: {
        user_id
      }
    })
    let infoImg = await this.prisma.image_like.findMany({
      where: {
        img_id
      },
      include: { users: true }
    })
    let likeByUser = infoImg.some(img => img.user_id === user_id)

    // Check user 
    if (!user) {
      throw new HttpException("User incorrect exits", 400)
    }

    // Check like
    if (likeByUser) {

      await this.prisma.image_like.deleteMany({
        where: {
          img_id,
          user_id
        }
      });
      throw new HttpException("Unlike", 200)

    }

    let data = {
      user_id,
      img_id,
      like_date: new Date(),
      emotion_id
    }
    await this.prisma.image_like.create({ data })
    throw new HttpException("Like", 200)

  }

  // List like 
  async listLikeImage(img_id: number) {

    let checkImage = await this.prisma.image_like.findMany(
      {
        where: {
          img_id
        },
        include: {
          users: true,
          emotion_type: true
        }
      }

    )

    return checkImage
  }

  // Comment
  async comment(body: any) {
    let { user_id, img_id, comment_content } = body

    if (!comment_content) {

      throw new HttpException("Comment content cannot be empty", 400)

    }

    let data = {
      user_id,
      img_id,
      comment_content,
      comment_date: new Date()
    }
    await this.prisma.image_comment.create({ data })
    throw new HttpException("OK", 200)
  }

  // Follow
  async follow(body: { user_id_follower: number, user_id_following: number }) {
    let { user_id_follower, user_id_following } = body
    let userFollow = await this.prisma.user_follow.findMany();
    let checkFollower = userFollow.some(userFollower => userFollower.user_id_follower === user_id_follower && userFollower.user_id_following === user_id_following)
    if (checkFollower) {
      await this.prisma.user_follow.deleteMany({
        where: {
          user_id_follower,
          user_id_following
        }
      })
      throw new HttpException("Unf", 400)
    }
    let data = {
      user_id_follower,
      user_id_following,
      date_follow: new Date()
    }
    await this.prisma.user_follow.create({ data })
    throw new HttpException(`Follow success `, 200)

  }

  // List follow 
  async listFollow() {
    let userFollow = await this.prisma.user_follow.findMany({

      select: {
        following: {
          select: {
            user_id: true,
            user_email: true,
            user_password: true,
            user_name: true,
            user_age: true,
            user_avatar: true,
            refresh_token: true
          }
        }
        ,
        follower: {
          select: {
            user_id: true,
            user_email: true,
            user_password: true,
            user_name: true,
            user_age: true,
            user_avatar: true,
            refresh_token: true
          }
        },
        date_follow: true,
      }
    });
    return userFollow
  }



}
