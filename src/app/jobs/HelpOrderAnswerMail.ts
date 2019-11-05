import { SentMessageInfo } from 'nodemailer';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class HelpOrderAnswerMail {
  get key(): string {
    return 'HelpOrderAnswerMail';
  }

  async handle({ data }): Promise<SentMessageInfo> {
    const {
      student,
      helpOrder: { question, answer, answer_at },
    } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Resposta a pedido de auxílio',
      template: 'helpOrderAnswer',
      context: {
        studentName: student.name,
        question,
        question_date: format(parseISO(answer_at), "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        answer,
      },
    });
  }
}

export default new HelpOrderAnswerMail();
