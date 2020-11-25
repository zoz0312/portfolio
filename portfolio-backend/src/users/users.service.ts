import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { invalidError, permossionError } from 'src/common/error-text';
import { Raw, Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { UpdateUserInput, UpdateUserOutput } from './dto/update-user.input';
import { User, UserRole } from './entities/user.entity';
import { errorUser } from './user-text';
import { FindUserInput, FindUserOutput } from './dto/find-user.dto';
import { FindUsersInput, FindUsersOutput } from './dto/find-usres.dto';
import { PAGE_NATION } from 'src/common/common.pagenation';
import { TOTAL_PAGES } from '../common/common.pagenation';
import { DeleteUserIntput, DeleteUserOutput } from './dto/delete-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}
  async createUser(
    { email, name, password, role }: CreateUserInput
  ): Promise<CreateUserOutput> {
    try {
      const user = await this.users.findOne(
        { email },
      );
      if (user) {
        return {
          ok: false,
          error: errorUser.alreadyEmail,
        }
      }

      if (role === UserRole.Admin) {
        return {
          ok: false,
          error: invalidError,
        }
      }

      await this.users.save(
        this.users.create({
          email,
          name,
          password,
          role,
        })
      );

      return {
        ok: true,
      }
    } catch {
      return {
        ok: false,
        error: permossionError,
      }
    }
  }

  async findAll(
    findUsersInput: FindUsersInput,
  ): Promise<FindUsersOutput> {
    try {
      const { email, role } = findUsersInput;
      const where = {};

      if (email) {
        if (email.length < 3) {
          return {
            ok: false,
            error: errorUser.searchLength,
          }
        }
        where['email'] = Raw(userEmail => `${userEmail} ILIKE '%${email}%'`);
      }

      if (role) {
        where['role'] = role;
      }

      const [users, totalResults] = await this.users.findAndCount({
        where,
        ...PAGE_NATION(findUsersInput.page),
        order: { id: 'ASC' }
      });

      return {
        ok: true,
        users,
        totalResults,
        totalPages: TOTAL_PAGES(totalResults),
      }
    } catch {
      return {
        ok: false,
        error: permossionError,
      }
    }
  }

  async findOne(
    { id }: FindUserInput
  ): Promise<FindUserOutput> {
    try {
      const user = await this.users.findOneOrFail({ id });
      return {
        ok: true,
        user,
      }
    } catch {
      return {
        ok: false,
        error: permossionError,
      }
    }
  }

  async update(
    { id, password, email, name, role, }: UpdateUserInput
  ): Promise<UpdateUserOutput> {
    try {
      const user = await this.users.findOne({ id });

      if (!user) {
        return {
          ok: false,
          error: errorUser.noUser,
        }
      }

      if (email) {
        user.email = email;
      }

      if (name) {
        user.name = name;
      }

      if (role) {
        if (role === UserRole.Admin) {
          return {
            ok: false,
            error: invalidError,
          }
        }
        user.role = role;
      }

      if (password) {
        // Validation password
        user.password = password;
      }

      await this.users.save(user);

      return {
        ok: true,
      }
    } catch {
      return {
        ok: false,
        error: permossionError,
      }
    }
  }

  async delete(
    { id }: DeleteUserIntput,
  ): Promise<DeleteUserOutput> {
    try {
      const user = await this.users.findOne({ id });

      if (!user) {
        return {
          ok: false,
          error: errorUser.noUser,
        }
      }

      await this.users.softDelete({ id });

      return {
        ok: true,
      }
    } catch {
      return {
        ok: false,
        error: permossionError,
      }
    }
  }
}
