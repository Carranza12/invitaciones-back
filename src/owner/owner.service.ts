import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Owner } from './schemas/owner.schema';
import { Company } from 'src/company/schemas/company.schema';
import { User } from 'src/auth/schemas/user.schema';
const moment = require('moment');
import { Resend } from 'resend';
import { env } from 'process';

@Injectable()
export class OwnerService {
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<Owner>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(req) {
    try {
      const { body } = req;

      const password = this.generateRandomPassword(12);

      const hash = await bcrypt.hash(password, 10);

      const userModelResult = await this.userModel.create({
        email: body.email,
        password: hash,
        name: body.name,
        last_name: body.last_name,
        role: 'owner',
        profileImage: '',
      });

      const id_user = userModelResult._id;

      const companyModelResult = await this.companyModel.create({
        propertie: id_user,
        name: body.bussinessName,
        typeBusiness: body.typeBusiness,
        members: [],
        description: '',
        tags: [],
        address: '',
        phone: body.phone,
      });

      const id_company = companyModelResult._id;

      const nextPaymentDate = moment().add(30, 'days').toDate();

      const ownerModelResult = await this.ownerModel.create({
        user_id: id_user,
        company_id: id_company,
        free30Days: true,
        planning_id: 'free',
        nextPaymentDate: nextPaymentDate,
        isActivePlanning: false,
        cancelFree30Days: false,
        passwordReset: false,
      });
      if (ownerModelResult && companyModelResult && userModelResult) {
        const resend = new Resend('re_a3sqH4uG_EsNAGVE9CigkBhs7SuWEeZmE');
        console.log("se va a enviar el correo...")
        resend.emails.send({
          from: 'onboarding@resend.dev',
          to: `franckgta3@gmail.com`,
          subject: 'Bienvenido a tuNegocio',
          html: `<p>
          ¡Hola ${body.name} ${body.last_name}!
          Todo el equipo de tuNegocio está muy emocionado por trabajar en conjunto con tu emprendimiento ${body.bussinessName} y por supuesto, también contigo. <br/>
          Para seguir con el proceso de registro, es necesario que configures tu cuenta lo más pronto posible.<br/>
          te hemos asignado la siguiente contraseña: <strong>${password}</strong>.
          Por favor, da clic al siguiente enlace para cambiarla y continuar con el proceso:
          </p>
          <a href="#">Cambiar contraseña</a>
          <p>¡Nos vemos en el siguiente paso!</p>`,
        });
      }
      return { message: 'Usuario registrado con exito!', type: 'success' };
    } catch (error) {
      console.log('error:', error);
      return { message: 'Ocurrio un error: ' + error, type: 'error' };
    }
  }

  async validateCompanie(companyName: string) {
    try {
      console.log("companyName 1:", companyName);
      companyName = companyName ? companyName.trim() : '';
      console.log("companyName 2:", companyName);
      const company = await this.companyModel.findOne({ name: companyName });
      console.log("company:", company);
      if (!company) {
        return { item: null, type: 'not-found' };
      }
      return { item: company, type: 'success' };
    } catch (error) {
      console.log('error:', error);
      return { message: 'Ocurrió un error: ' + error, type: 'error' };
    }
  }
  

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const resetToken = this.jwtService.sign(
      { email: user.email },
      { secret: 'your-secret-key', expiresIn: '24h' },
    );

    const resetLink = `https://your-domain.com/reset-password?token=${resetToken}`;

    const resend = new Resend('re_a3sqH4uG_EsNAGVE9CigkBhs7SuWEeZmE');

    await resend.emails.send({
      from: 'support@yourdomain.com',
      to: user.email,
      subject: 'Restablecer contraseña',
      html: `<p>
      ¡Hola ${user.name} ${user.last_name}!
      Hemos recibido una solicitud para restablecer tu contraseña. Por favor, da clic al siguiente enlace para cambiar tu contraseña:
      </p>
      <a href="${resetLink}">Restablecer contraseña</a>
      <p>Si no solicitaste un restablecimiento de contraseña, por favor ignora este correo.</p>`,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: 'your-secret-key',
      });
      const email = decoded.email;

      const hash = await bcrypt.hash(newPassword, 10);

      
    await this.userModel.findOneAndUpdate(
      { email },
      { password: hash },
    );

    const userModel = await this.userModel.findOne({ email });
    if (!userModel) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.ownerModel.findOneAndUpdate(
      { user_id: userModel._id },
      { passwordReset: true },
    );
    

    } catch (error) {
      throw new NotFoundException('Token inválido o expirado');
    }
  }

  generateRandomPassword(length) {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789£$&*#@!';
    let password = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }
}
