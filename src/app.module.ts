import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ImagesModule } from './images/images.module';




@Module({
  imports: [UserModule,

    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({ global: true }),
    ImagesModule,
    
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule { }
