import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { registrationDto } from './dto/registration.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  regitration(@Body() body: registrationDto): Promise<User> {
    return this.authService.registration(body);
  }

  @Post('/login')
  login(@Body() body: loginDto): Promise<User> {
    return this.authService.login(body);
  }

}
