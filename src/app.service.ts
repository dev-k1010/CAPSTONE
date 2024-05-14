import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getTinhTong(so1:number,so2:number): number{
    return so1+ so2
  }
}
