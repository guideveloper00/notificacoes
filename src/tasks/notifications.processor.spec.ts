import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsProcessor } from './notifications.processor';
import { EmailService } from '../email/email.service';
import { Job } from 'bull';

describe('NotificationsProcessor', () => {
  let processor: NotificationsProcessor;
  let emailService: EmailService;

  beforeEach(async () => {
    const mockEmailService = {
      sendEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsProcessor,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    processor = module.get<NotificationsProcessor>(NotificationsProcessor);
    emailService = module.get<EmailService>(EmailService);
  });

  it('deve processar a notificação e chamar o sendEmail', async () => {
    const job: Job = {
      data: {
        email: 'user@example.com',
        taskId: 1,
      },
    } as any;

    await processor.handleNotification(job);

    expect(emailService.sendEmail).toHaveBeenCalledWith(
      'user@example.com',
      'Tarefa Concluída',
      'A tarefa 1 foi marcada como concluída.'
    );
  });
});
