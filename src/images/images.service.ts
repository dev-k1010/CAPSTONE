import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ImagesService {
    prisma = new PrismaClient

    // Upload
    async upLoadImg({ file, body }) {
        return new Promise(async (resolve, reject) => {
            try {
                // Check file
                if (!file) {

                    throw new HttpException("No file uploaded", HttpStatus.BAD_REQUEST);
                }
                let { user_id, img_name, img_decription } = body
                let data = {
                    user_id: parseInt(user_id),
                    img_name,
                    img_decription,
                    img_href: "http://localhost:8080/public/img/" + file.filename,
                    img_date: new Date()
                }
                // Check key
                let emptyKeys = []
                Object.keys(body).forEach(key => {
                    let value = body[key];
                    if (!value) {
                        emptyKeys.push(key)
                    }
                });

                if (emptyKeys.length > 0) {
                    throw new HttpException(`Keys [${emptyKeys.join(', ')}] have falsy values.`, 400);
                }
                await this.prisma.images.create({ data })
                resolve("Upload success");

            } catch (error) {
                reject(error);
            }
        });
    }

    // List images
    async listImages(body: any) {
        let data = []
        if (body && Object.keys(body).length > 0) {
            data = await this.prisma.images.findMany({
                where: {
                    OR: Object.keys(body).map(key => ({
                        img_name: {
                            contains: body[key]
                        }
                    }))
                }
            });
        } else {
            data = await this.prisma.images.findMany();
        }
        return data
    }

    // List comment of imgae
    async listComment(img_id: number) {
        let checkId = await this.prisma.image_comment.findMany({
            where: {
                img_id
            }
        })

        return checkId
    }

    // Images create by User
    async imageByUser(user_id: number) {
        let imageByUser = await this.prisma.images.findMany({
            where: {
                user_id
            }
        })
        return imageByUser
    }

    // Delete image by User
    async deleteImage(body) {
        let { img_id, user_id } = body
        let imageByUser = await this.prisma.images.findFirst({
            where: {
                user_id,
                img_id
            }
        })
        if (imageByUser) {
            await this.prisma.images.delete({
                where: {
                    user_id,
                    img_id
                }
            })
            throw new HttpException("Delete success", 200)
        }
        throw new HttpException("Verify values user_id or img_id", 400)
    }

    // Info image
    async infoImage(img_id: number) {
        let data = await this.prisma.images.findFirst({
            where: {
                img_id
            },
            include: {
                users: true
            }

        })
        return data
    }

    // Save image
    async imageSave(body: any) {
        let { user_id, img_id,category_id } = body
        let checkSave = await this.prisma.image_save.findFirst({
            where: {
                user_id,
                img_id
            }
        })
        if (checkSave) {
            await this.prisma.list_image.deleteMany({
                where: {
                    img_id,
                    category_id
                }
            })
            await this.prisma.image_save.deleteMany({
                where: {
                    img_id,
                    user_id
                }
            })
            throw new HttpException("Cancel save image", 200)
        }
        // let data = {
        //     user_id,
        //     img_id,
        //     date_save: new Date()
        // }
        // await this.prisma.image_save.create({ data })
        // throw new HttpException("Save success", 200)

    }

}
