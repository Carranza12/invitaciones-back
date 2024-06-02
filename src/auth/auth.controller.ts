import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    UnauthorizedException,
    Req,
    Put,
    Param,
    Delete,
    Query,
    ParamData,
    UseInterceptors,
    UploadedFile,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { User } from './schemas/user.schema';
  import { AuthGuard } from './auth.guard';
  import { Request, } from 'express';
  import { FileInterceptor } from '@nestjs/platform-express';
  
  @Controller('api/auth')
  export class AuthController {
    constructor(private readonly _authSvc: AuthService) {}
  
   
  
    @Post('register')
    //@UseGuards(AuthGuard)
    async registerUser(
      @Req() request: Request,
    ): Promise<{ message: string }> {
      try {
        return await this._authSvc.createNewUser(request);
      } catch (error) {
        console.log('error:', error);
        throw new UnauthorizedException(
          'No tienes permiso para registrar nuevos usuarios.',
        );
      }
    }
  
    @Put('users/:id')
    @UseGuards(AuthGuard)
    async updateUser(
      @Param('id') userId: string,
      @Body() body: User,
      @Req() request: any,
    ): Promise<{ message: string }> {
      try {
        const currentUser = await this._authSvc.getUserById(
          request.user.userId,
        );
  
        if (currentUser.role !== 'superAdmin') {
          throw new UnauthorizedException(
            'No tienes permiso para editar usuarios.',
          );
        }
  
        await this._authSvc.updateUser(userId, body);
        return { message: 'Usuario actualizado con éxito.' };
      } catch (error) {
        throw new UnauthorizedException(
          'No tienes permiso para editar usuarios.',
        );
      }
    }
  
    @Delete('users/:id')
    @UseGuards(AuthGuard)
    async deleteUser(
      @Param('id') userId: string,
      @Req() request: any
    ): Promise<{ message: string }> {
      try {
        const currentUser = await this._authSvc.getUserById(
          request.user.userId,
        );
          if (currentUser.role !== 'superAdmin') {
            throw new UnauthorizedException(
              'No tienes permiso para eliminar usuarios.',
            );
          }
        
      //  await this._authSvc.deleteUser(userId);
        return { message: 'Usuario eliminado con éxito.' };
      } catch (error) {
        throw new UnauthorizedException(
          'No tienes permiso para eliminar usuarios.',
        );
      }
    }
  
    @Post('login')
    async loginUser(
      @Body() body: { email: string; password: string },
    ): Promise<{ message: string; token: string }> {
      const { email, password } = body;
      const respuesta = await this._authSvc.loginUser(email, password);
      return { message: 'Login successful', ...respuesta };
    }
  
    @Get('users')
    @UseGuards(AuthGuard)
    async getUsers(@Req() request: any): Promise<User[]> {
      try {
        const user = await this._authSvc.getUserById(request.user.userId);;
        request.query.page = request.query.page ? request.query.page : 1;
    
        const {
          name,
          lastname,
          email,
          role_default,
        } = request.query;
  
        let filters: any = {};
  
        if (name) {
          filters.name = { $regex: new RegExp(name, 'i') };
        }
  
        if (lastname) {
          filters.lastname = { $regex: new RegExp(lastname, 'i') };
        }
  
        if (email) {
          filters.email = { $regex: new RegExp(email, 'i') };
        }
        if (role_default) {
          filters.role_default = { $regex: new RegExp(role_default, 'i') };
        }
       
  
        if (user.role === 'superAdmin') {
          return this._authSvc.getUsers(request.query.page, 5, filters);
        }
  
        throw new UnauthorizedException(
          'No tienes permiso para acceder a esta ruta.',
        );
      } catch (error) {
        throw new UnauthorizedException(
          'No tienes permiso para acceder a esta ruta.',
        );
      }
    }
  
    @Get('users/all')
    @UseGuards(AuthGuard)
    async getAllUsers(@Req() request: any): Promise<User[]> {
      try {
        const user = await this._authSvc.getUserById(request.user.userId);;
        request.query.page = request.query.page ? request.query.page : 1;
  
        if (user.role === 'superAdmin') {
          return this._authSvc.getAllUsers();
        }
  
        throw new UnauthorizedException(
          'No tienes permiso para acceder a esta ruta.',
        );
      } catch (error) {
        throw new UnauthorizedException(
          'No tienes permiso para acceder a esta ruta.',
        );
      }
    }
  /* 
    @Get('users/maestros')
    @UseGuards(AuthGuard)
    async getMaestors(@Req() request: any): Promise<User[]> {
      try {
        const user = await this.userAuthService.getUserById(request.user.userId);;
        request.query.page = request.query.page ? request.query.page : 1;
        
        const {
          name,
          last_name,
          email,
          role_default,
        } = request.query;
  
        let filters: any = {};
  
        if (name) {
          filters.name = { $regex: new RegExp(name, 'i') };
        }
  
        if (last_name) {
          filters.last_name = { $regex: new RegExp(last_name, 'i') };
        }
  
        if (email) {
          filters.email = { $regex: new RegExp(email, 'i') };
        }
        if (role_default) {
          filters.role_default = { $regex: new RegExp(role_default, 'i') };
        }
  
        if (user.role_default === 'superAdmin') {
          return this.userAuthService.getMaestros(request.query.page, 5, filters);
        }
  
        throw new UnauthorizedException(
          'No tienes permiso para acceder a esta ruta.',
        );
      } catch (error) {
        throw new UnauthorizedException(
          'No tienes permiso para acceder a esta ruta.',
        );
      }
    }
  
    @Get('users/estudiantes')
    @UseGuards(AuthGuard)
    async getEstudiantes(@Req() request: any): Promise<User[]> {
      try {
        const user = await this.userAuthService.getUserById(request.user.userId);;
        request.query.page = request.query.page ? request.query.page : 1;
        console.log("page:",  request.query)
        const {
          name,
          last_name,
          email,
          role_default,
        } = request.query;
  
        let filters: any = {};
  
        if (name) {
          filters.name = { $regex: new RegExp(name, 'i') };
        }
  
        if (last_name) {
          filters.last_name = { $regex: new RegExp(last_name, 'i') };
        }
  
        if (email) {
          filters.email = { $regex: new RegExp(email, 'i') };
        }
        if (role_default) {
          filters.role_default = { $regex: new RegExp(role_default, 'i') };
        }
        if (user.role_default === 'superAdmin') {
          return this.userAuthService.getEstudiantes(request.query.page, 5, filters);
        }
  
        throw new UnauthorizedException(
          'No tienes permiso para acceder a esta ruta.',
        );
      } catch (error) {
        throw new UnauthorizedException(
          'No tienes permiso para acceder a esta ruta.',
        );
      }
    }
   */
    @Get('user/:id')
    @UseGuards(AuthGuard)
    async getUser(
      @Req() request: any,
      @Param('id') id: string,
    ): Promise<User> {
      try {
        const user = await this._authSvc.getUserById(request.user.userId);
  
        if (user.role === 'superAdmin' || user.role === 'customer' || user.role === 'owner') {
          return this._authSvc.getUserById(id);
        }
  
        throw new UnauthorizedException(
          'No tienes permiso para acceder a esta ruta.',
        );
      } catch (error) {
        throw new UnauthorizedException(
          'No tienes permiso para acceder a esta ruta.',
        );
      }
    }
  
  
    @Get('user/email/:email')
    @UseGuards(AuthGuard)
    async getUserByEmail(
      @Req() request: Request,
      @Param('email') email: string,
    ): Promise<any> {
      try {
        await this._authSvc.getUserByEmail(email);
      } catch (error) {
        throw new UnauthorizedException(
          'No tienes permiso para acceder a esta ruta.',
        );
      }
    }
  
  
  }
  