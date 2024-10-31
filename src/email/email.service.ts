import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // Este não é um dominio real, é apenas um teste técnico com codigos reais e funcionais.
      host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.SMTP_USER || 'd54c9d25be625e',
        pass: process.env.SMTP_PASS || '8a0214ad368ece',
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        from: `"NestJS App" <no-reply@myapp.com>`,
        to,
        subject,
        text,
      });
      console.log(`E-mail enviado para ${to}`);
    } catch (error) {
      console.error(`Erro ao enviar e-mail para ${to}: ${error.message}`);
    }
  }
}
