import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class EnrollMail {
  get key() {
    return 'EnrollMail';
  }

  async handle({ data }) {
    const {
      student,
      enrollment: { start_date, end_date, price },
    } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula GymPoint',
      template: 'enroll',
      context: {
        studentName: student.name,
        start_date: format(parseISO(start_date), "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        end_date: format(parseISO(end_date), "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        price,
      },
    });
  }
}

export default new EnrollMail();
