import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from '../email/email.service';
import { Injectable } from '@nestjs/common';

@Processor('notifications')
@Injectable()
export class NotificationsProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('send-notification')
  async handleNotification(job: Job) {
    const { email, taskId } = job.data;
    
    try {
      await this.emailService.sendEmail(
        email,
        'Tarefa Concluída',
        `A tarefa ${taskId} foi marcada como concluída.`
      );
      console.log(`E-mail enviado para ${email}`);
    } catch (error) {
      console.error(`Erro ao enviar e-mail para ${email}: ${error.message}`);
    }
  }
}
