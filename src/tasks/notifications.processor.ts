import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('notifications')
export class NotificationsProcessor {
  @Process()
  async handleNotification(job: Job) {
    const { taskId, email } = job.data;
    
    console.log(`Notificação de tarefa ${taskId} enviada para o e-mail: ${email}`);
  }
}
