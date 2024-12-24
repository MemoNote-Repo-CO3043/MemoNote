import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;
const secretKey = 'secret';
@Injectable()
export class UserService {
  constructor(private readonly firebaseService: FirebaseService) {}
  async createHash(password: string) {
    return await bcrypt.hash(password, saltRounds);
  }
  async login(username: string, password: string) {
    const user = await this.firebaseService.getUser(username);
    if (await bcrypt.compare(password, user.password)) {
      return {
        access_token: jwt.sign({ id: user.userId }, secretKey, {
          expiresIn: '10h',
        }),
      };
    }
    throw new NotFoundException('Invalid username or password');
  }
  async register(username: string, password: string) {
    password = bcrypt.hashSync(password, saltRounds);
    const user = await this.firebaseService.createUser(username, password);
    return {
      access_token: jwt.sign({ id: user.userId }, secretKey, {
        expiresIn: '10h',
      }),
    };
  }
}
