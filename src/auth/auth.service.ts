import {
    Injectable,
    NotFoundException,
    Logger,
    UnauthorizedException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { User } from './schemas/user.schema';
  import * as bcrypt from 'bcrypt';
  import { JwtService } from '@nestjs/jwt';
  import * as path from 'path';
  import * as fs from 'fs';
  
  @Injectable()
  export class AuthService {
    private readonly logger = new Logger(AuthService.name);
  
    constructor(
      @InjectModel(User.name) private userModel: Model<User>,
      private jwtService: JwtService,
    ) {}
  
    async loginUser(email: string, password: string): Promise<any> {
      try {
        console.log('email:', email);
        const user = await this.userModel.findOne({ email });
        console.log('USUARIO ENCONTRADO:', user);
        if (!user) {
          throw new NotFoundException('User not found');
        }
  
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new UnauthorizedException('Invalid login credentials');
        }
        const payload = { userId: user._id };
        const token = this.jwtService.sign(payload);
        console.log('token:', token);
        return {
          token,
          full_name: user.name + ' ' + user.last_name,
          role: user.role,
          email: user.email,
          profileImage: user.profileImage,
          user_id: user._id,
        };
      } catch (error) {
        console.log(error);
        throw new UnauthorizedException('An error occurred while logging in');
      }
    }
    async getUsers(page: number, limit: number, filters: any): Promise<any> {
      try {
        const totalUsers = await this.userModel.countDocuments();
        const totalPages = totalUsers === 0 ? 1 : Math.ceil(totalUsers / limit);
  
        if (page < 1 || page > totalPages) {
          throw new Error('Página no válida');
        }
        let users = [];
        if (Object.keys(filters).length > 0) {
          users = await this.userModel
            .find(filters)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        } else {
          users = await this.userModel
            .find()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        }
        return {
          items: users || [],
          currentPage: page,
          totalPages: Array.from({ length: totalPages }, (_, i) =>
            (i + 1).toString(),
          ),
        };
      } catch (error) {
        this.logger.error(
          `An error occurred while retrieving users: ${error.message}`,
        );
        throw new Error('An error occurred while retrieving users');
      }
    }
  
    async getAllUsers(): Promise<any> {
      try {
       
          const users = await this.userModel
            .find()
       
        return {
          items: users
        };
      } catch (error) {
        this.logger.error(
          `An error occurred while retrieving users: ${error.message}`,
        );
        throw new Error('An error occurred while retrieving users');
      }
    }
  
    async getCustomers(page: number, limit: number, filters: any): Promise<any> {
      try {
        const totalUsers = await this.userModel.countDocuments({
          role_default: 'maestro',
        });
        const totalPages = totalUsers === 0 ? 1 : Math.ceil(totalUsers / limit);
  
        if (page < 1 || page > totalPages) {
          throw new Error('Página no válida');
        }
        let users = [];
        if (Object.keys(filters).length > 0) {
          users = await this.userModel
            .find({ ...filters, role: 'customer' })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        } else {
          users = await this.userModel
            .find({ role: 'customer' })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        }
  
        return {
          items: users || [],
          currentPage: page,
          totalPages: Array.from({ length: totalPages }, (_, i) =>
            (i + 1).toString(),
          ),
        };
      } catch (error) {
        this.logger.error(
          `An error occurred while retrieving users: ${error.message}`,
        );
        throw new Error('An error occurred while retrieving users');
      }
    }
  
    async getOwners(
      page: number,
      limit: number,
      filters: any,
    ): Promise<any> {
      try {
        const totalUsers = await this.userModel.countDocuments({
          role_default: 'estudiante',
        });
        const totalPages = totalUsers === 0 ? 1 : Math.ceil(totalUsers / limit);
        if (page < 1 || page > totalPages) {
          throw new Error('Página no válida');
        }
        let users = [];
        if (Object.keys(filters).length > 0) {
          users = await this.userModel
            .find({ ...filters, role: 'owner' })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        } else {
          users = await this.userModel
            .find({ role: 'estudiownerante' })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        }
  
        return {
          items: users,
          currentPage: page,
          totalPages: Array.from({ length: totalPages }, (_, i) =>
            (i + 1).toString(),
          ),
        };
      } catch (error) {
        this.logger.error(
          `An error occurred while retrieving users: ${error.message}`,
        );
        throw new Error('An error occurred while retrieving users');
      }
    }
  
    async getUserById(userId: string): Promise<User> {
      try {
        return await this.userModel.findById(userId).exec();
      } catch (error) {
        throw new NotFoundException('Usuario no encontrado');
      }
    }
  
    async getUserByEmail(email: string): Promise<User | null> {
      try {
        const respuesta = await this.userModel.findOne({ email }).exec();
        return respuesta;
      } catch (error) {
        throw new NotFoundException('Usuario no encontrado');
      }
    }
  
    async createNewUser(req) {
      try {
        const { body } = req;
       
        const { password } = body;
  
        const hash = await bcrypt.hash(password, 10);
  
        const userModelResult = await this.userModel.create({
          ...body,
          password: hash
        });
        return { message: 'Usuario registrado con exito!' };
      } catch (error) {
        console.log('error:', error);
        throw new Error('An error occurred while registering the user');
      }
    }
  
    async updateUser(userId: string, userData: User): Promise<any> {
      try {
        const existingUser = await this.userModel.findById(userId);
  
        if (!existingUser) {
          throw new NotFoundException('Usuario no encontrado');
        }
  
        let hash = '';
        const { ...updatedUserData } = userData;
        if (!userData.password) {
          delete userData.password;
        }
        if (userData.password) {
          console.log('si existe pass...');
          hash = await bcrypt.hash(userData.password, 10);
          userData.password = hash;
        }
  
        let item_to_udate = {
          ...userData
        };
  
        console.log('item_to_udate:', item_to_udate);
        await this.userModel.findByIdAndUpdate(userId, item_to_udate);
  
        return { message: 'Usuario actualizado con exito!' };
      } catch (error) {
        throw new Error('An error occurred while updating the user');
      }
    }
  
    /* async deleteUser(userId: string): Promise<void> {
      try {
        const existingUser = await this.userModel.findById(userId);
  
        if (!existingUser) {
          throw new NotFoundException('Usuario no encontrado');
        }
        await this.userModel.findByIdAndRemove(userId);
      } catch (error) {
        throw new Error('An error occurred while deleting the user');
      }
    } */
  }
  