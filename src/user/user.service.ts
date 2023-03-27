import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { hash } from 'bcrypt';
import { userInfo } from 'os';

@Injectable()
export class UserService {
  private usersList: User[] = [];

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const emailAlreadyInUse = this.usersList.find(user => user.email === email);

    if (emailAlreadyInUse) {
      throw new Error('email already in use');
    }

    delete createUserDto.passwordConfirmation;

    const hashedPassword = await hash(password, 10);

    const newUser: User = {
      ...createUserDto,
      password: hashedPassword,
      id: uuid()
    }

    this.usersList.push(newUser);

    return "User successfully created";
  }

  findAll() {
    return this.usersList.map(user => {
      delete user.password;
      return user;
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {

    const userIndex = this.usersList.findIndex(user => user.id === id);

    if (userIndex < 0) {
      throw new Error(`User with id ${id} do not exists`)
    }

    this.usersList = this.usersList.filter(user => user.id !== id);
  }
}
