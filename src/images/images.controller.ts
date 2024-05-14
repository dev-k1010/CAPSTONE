import { Body, Controller, Delete, Get, HttpException, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { unlinkSync } from 'fs';
import { AuthGuard } from '@nestjs/passport';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  // Upload Image
  @UseGuards(AuthGuard("khoa_token"))
  @UseInterceptors(FileInterceptor("avatar", {
    storage: diskStorage({
      destination: process.cwd() + "/public/img",
      filename: (req, file, callback) => callback(null, new Date().getTime() + "_" + file.originalname)
    })
  }))
  @Post("/upload")
  async upLoadImg(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: {
      user_id: number,
      img_name: string,
      img_decription: string
    }
  ) {
    try {

      let response = await this.imagesService.upLoadImg({ file, body });
      return response;

    } catch (exception) {
      // Check if the file has been created, then delete it to avoid saving to in derectory 
      if (file) {
        unlinkSync(file.path); // Delete file
      }

      throw new HttpException(exception.response, exception.status);

    }
  }

  // List images
  @Get("/list-images")
  listImages(@Body() body: { keySearch: string }) {
    try {
      return this.imagesService.listImages(body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status);

    }
  }

  // List comment of image
  @Get("/list-comment/:img_id")
  listCommnet(@Param("img_id") img_id: string) {
    try {
      return this.imagesService.listComment(Number(img_id))
    } catch (error) {

    }
  }

  // Images create by User
  @Get("/list-images/:user_id")
  imageByUser(@Param("user_id") user_id) {
    try {
      return this.imagesService.imageByUser(Number(user_id))
    } catch (exception) {
      throw new HttpException(exception.response, exception.status);
    }
  }

  // Delete image
  @UseGuards(AuthGuard("khoa_token"))
  @Delete("/delete")
  deleteImage(@Body() body: { img_id: number, user_id: number }) {
    try {
      return this.imagesService.deleteImage(body)
    } catch (error) {

    }
  }

  // Info images 
  @Get("/info-image/:img_id")
  infoImage(@Param("img_id") img_id: any) {

    return this.imagesService.infoImage(Number(img_id))

  }
  // Save image
  @Post("/save-image")
  saveImage(@Body() body: { user_id: number, img_id: number, category_id: number }) {
    try {
      return this.imagesService.imageSave(body)
    } catch (exception) {
      throw new HttpException(exception.response, exception.status)
    }
  }
}
