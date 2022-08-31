import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { registrationDto } from './dto/registration.dto';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async registration(registration: registrationDto): Promise<User> {
    const user = this.userRepo.create(registration);
    return await this.userRepo.save(user);
  }

  async login(login: loginDto): Promise<User> {
    try {
      const user = await this.userRepo.findOne({
        where: { email: login.email },
      });
      const isValid = await user.comparePassword(login.password);

      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
