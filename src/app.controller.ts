import { Controller, Get, HttpCode, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @HttpCode(200)
  @Get("/tinhTong/:so1/:so2")

  getHello(@Param ("so1")

  so1:number, @Param("so2") so2:number ): number {

    return this.appService.getTinhTong(Number(so1),Number(so2));
  }
}
