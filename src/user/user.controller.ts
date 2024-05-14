import { Controller, Get, Post, Body, HttpException, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';


// 3 option create "type" - type, class, interface
// type signUp 
type data = {
  user_email: string,
  user_password: string,
  user_name: string,
  user_age: number,
}
type dataComment = {
  user_id: number,
  img_id: number,
  comment_content: string
}
type updateUser = {
  user_id: number,
  user_email: string,
  user_password: string,
  user_name: string,
  user_age: number,
  user_avatar: string,
}


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // Info User
  @UseGuards(AuthGuard("khoa_token"))
  @Get("/:user_id")
  infoUser(@Param("user_id") user_id: string) {
    return this.userService.infoUser(Number(user_id));
  }

  // Update info user
  @UseGuards(AuthGuard("khoa_token"))
  @Put("/update-user")
  updateUser(@Body() body: updateUser) {
    try {
      return this.userService.updateUser(body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)

    }
  }

  // Sign Up
  @Post("/signUp")
  signUp(@Body() dataSignUp: data) {
    try {

      return this.userService.signUp(dataSignUp);

    } catch (exception) {

      throw new HttpException(exception.response, exception.status)

    }
  }

  // Login
  @Post("/login")
  login(@Body() body) {
    try {

      return this.userService.login(body);

    } catch (exception) {

      throw new HttpException(exception.response, exception.status)

    }
  }

  // Like 
  @Post('/like')
  likeImg(
    @Body() body: { user_id: number, img_id: number, emotion_id: number }
  ) {
    try {

      return this.userService.likeImg(body);


    } catch (exception) {

      throw new HttpException(exception.response, exception.status)

    }
  }

  // Comment 
  @Post('/comment')
  comment(@Body() body: dataComment) {
    try {

      return this.userService.comment(body);

    } catch (exception) {

      throw new HttpException(exception.response, exception.status)

    }
  }

  // Follow
  @Post('/follow')
  follow(@Body() body: { user_id_follower: number, user_id_following: number }) {
    try {

      return this.userService.follow(body);

    } catch (exception) {

      throw new HttpException(exception.response, exception.status)

    }
  }

  // List follow
  @Get("/list-follow")
  listFollow() {
    try {
      return this.userService.listFollow()
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }


}
