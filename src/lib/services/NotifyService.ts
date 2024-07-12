import nodemailer from "nodemailer";

class MailService {
  static transporter = nodemailer.createTransport({
    host: "smtp.timeweb.ru",
    port: 465, // Безопасный порт, использующий SSL
    secure: true, // true для 465 порта, false для других портов
    auth: {
      user: "no-reply@gidcaf.ru", // адрес электронной почты на Яндексе
      pass: "3!#3<uGF)lt0#Y", // пароль от почты на Яндексе
    },
  });

  constructor() {}

  async send(options: {
    to: string | string[];
    subject: string;
    text: string;
  }): Promise<void> {
    const { to, subject, text } = options;

    const mailOptions = {
      from: '"GIDCAF" <no-reply@gidcaf.ru>', // адрес отправителя
      to, // список получателей
      subject, // Тема письма
      html: text, // HTML тело письма
    };

    try {
      const info = (await new Promise((resolve, reject) => {
        MailService.transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return reject(error);
          }
          resolve(info);
        });
      })) as any;

      console.log("Письмо успешно отправлено: %s", info.messageId);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new MailService();
