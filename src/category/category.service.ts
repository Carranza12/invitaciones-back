import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
const moment = require('moment');
import { Resend } from 'resend';
import { env } from 'process';
import { Category } from './category.schema';

@Injectable()
export class CategoryService {
  logger: any;
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private jwtService: JwtService,
  ) {}

  async create(req) {
    try {
      const { body } = req;

      const newcategory = new this.categoryModel({
        name: body.name,
        status: body.status,
        createdAt: new Date(),
        subcategories: body.subcategories,
      });

      const createdSubcategory = await newcategory.save();
      return { message: 'Item creado con exito!', type: 'success' };
    } catch (error) {
      console.log('error:', error);
      return { message: 'Ocurrio un error: ' + error, type: 'error' };
    }
  }

  async get(page: number, limit: number, filters: any): Promise<any> {
    try {
      const totalUsers = await this.categoryModel.countDocuments();
      const totalPages = totalUsers === 0 ? 1 : Math.ceil(totalUsers / limit);

      if (page < 1 || page > totalPages) {
        throw new Error('Página no válida');
      }
      let users = [];
      if (Object.keys(filters).length > 0) {
        users = await this.categoryModel
          .find(filters)
          .skip((page - 1) * limit)
          .limit(limit)
          .exec();
      } else {
        users = await this.categoryModel
          .find()
          .skip((page - 1) * limit)
          .limit(limit)
          .exec();
      }
      return {
        totalItems: totalUsers,
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
  async getById(userId: string): Promise<any> {
    try {
      return await this.categoryModel.findById(userId).exec();
    } catch (error) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }

  async update(id: string, data: any): Promise<any> {
    try {
      const existing: any = await this.categoryModel.findById(id);
      if (!existing._doc) {
        throw new NotFoundException('item no encontrado');
      }

      let item_to_udate = {
        ...existing._doc,
        ...data,
      };

      await this.categoryModel.findByIdAndUpdate(id, item_to_udate);
      return { message: 'item actualizado con exito!' };
    } catch (error) {
      throw new Error('An error occurred while updating the item');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const existing = await this.categoryModel.findById(id);

      if (!existing) {
        throw new NotFoundException('item no encontrado');
      }
      await this.categoryModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('An error occurred while deleting the user');
    }
  }
}
