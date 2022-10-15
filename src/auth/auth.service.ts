import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { registrationDto } from './dto/registration.dto';
import { loginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private mailService: MailService,
  ) {}

  async registration(registration: registrationDto): Promise<User> {
    try {
      const condidate = await this.userRepo.findOne({
        where: [{ email: registration.email }, { name: registration.name }],
      });

      if (condidate) {
        throw new UnauthorizedException('User already exists');
      }

      const user = this.userRepo.create(registration);
      await this.userRepo.save(user);
      this.mailService.sendUserConfirmation(user.email, user.name, user.id);
      return user;
    } catch (error) {
      console.log(error.message);
    }
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

  async confirm(query: { uuid: any }): Promise<string> {
    try {
      const user = await this.userRepo.findOne({ where: { id: query.uuid } });

      if (user.confirmed === true) {
        throw new UnauthorizedException('User already confirmed');
      }

      user.confirmed = true;
      await this.userRepo.save(user);

      return 'user confirmed';
    } catch (error) {
      console.log(error.message);
    }
  }
}
