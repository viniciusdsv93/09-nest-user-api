import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  private usersList: User[] = [];

  constructor(private readonly prismaService: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const emailAlreadyInUse = await this.prismaService.user.findUnique({
      where: {
        email
      }
    })

    if (emailAlreadyInUse) {
      throw new Error('email already in use');
    }

    const user: User = {
      id: uuid(),
      email,
      password: await hash(password, 10)
    }

    const createdUser = await this.prismaService.user.create({
      data: user
    })

    return {
      ...createdUser,
      password: undefined
    }
  }

  async findAll() {
    return await this.prismaService.user.findMany();
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
