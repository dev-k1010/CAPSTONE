import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { config } from 'src/config/config';

@Module({
 
  controllers: [
    UserController
  ],
  providers: [UserService,config],
})
export class UserModule {}
