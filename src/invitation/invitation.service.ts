import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
const moment = require('moment');
import { Resend } from 'resend';
import { env } from 'process';
import { Invitation } from './invitation.schema';
import { FileService } from 'src/services/file/file.service';

@Injectable()
export class InvitationService {
  logger: any;
  constructor(
    @InjectModel(Invitation.name) private InvitationModel: Model<Invitation>,
    private jwtService: JwtService,
    private fileService: FileService,
  ) {}

  async create(req, image: any) {
    try {
      const { body } = req;

       const newInvitation = new this.InvitationModel({
        banner_background: '',
        banner_name: body.banner_name || '',
        banner_slogan: body.banner_slogan || '',
        createdAt: new Date(),
      });

      const createdInvitation = await newInvitation.save();

      const folder = `invitations/${createdInvitation._id}`;
      const backgroundUrl = await this.fileService.saveFile(image, folder);

      createdInvitation.banner_background = backgroundUrl;
      await createdInvitation.save(); 

      return { message: 'Item creado con exito!', type: 'success' };
    } catch (error) {
      console.log('error:', error);
      return { message: 'Ocurrio un error: ' + error, type: 'error' };
    }
  }

 /*  async get(page: number, limit: number, filters: any): Promise<any> {
    try {
      const totalUsers = await this.subcategoryModel.countDocuments();
      const totalPages = totalUsers === 0 ? 1 : Math.ceil(totalUsers / limit);

      if (page < 1 || page > totalPages) {
        throw new Error('Página no válida');
      }
      let users = [];
      if (Object.keys(filters).length > 0) {
        users = await this.subcategoryModel
          .find(filters)
          .skip((page - 1) * limit)
          .limit(limit)
          .exec();
      } else {
        users = await this.subcategoryModel
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
      return await this.subcategoryModel.findById(userId).exec();
    } catch (error) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }

  async update(id: string, data: any, image: any): Promise<any> {
    try {
      const existing: any = await this.subcategoryModel.findById(id);
      console.log('ipdate...');
      if (!existing._doc) {
        throw new NotFoundException('item no encontrado');
      }

      let item_to_udate = {
        ...existing._doc,
        ...data,
      };
      if (image) {
        const folder = `subcategory/${id}`;
        const imageUrl = await this.fileService.saveFile(image, folder);
        item_to_udate.image = imageUrl;
      }
      console.log('item_to_udate:', item_to_udate);
      await this.subcategoryModel.findByIdAndUpdate(id, item_to_udate);
      return { message: 'item actualizado con exito!' };
    } catch (error) {
      throw new Error('An error occurred while updating the item');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const existing = await this.subcategoryModel.findById(id);

      if (!existing) {
        throw new NotFoundException('item no encontrado');
      }
      await this.subcategoryModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('An error occurred while deleting the user');
    }
  } */
}
