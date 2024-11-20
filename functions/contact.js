// Importar nodemailer (ES Modules)
import nodemailer from 'nodemailer';
// Importar Busboy (con wrapper para evitar problemas)
import pkg from 'busboy';
const Busboy = pkg.default || pkg;

export const handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    if (event.httpMethod !== 'POST') {
      return resolve({
        statusCode: 405,
        body: 'Método no permitido',
      });
    }

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('binary')
      : event.body;

    // Crear instancia de Busboy
    const busboy = new Busboy({ headers: event.headers });
    const formData = {};
    let fileBuffer = [];
    let fileName, fileType;

    busboy.on('field', (fieldname, val) => {
      formData[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      fileName = filename;
      fileType = mimetype;

      file.on('data', (data) => {
        fileBuffer.push(data);
      });

      file.on('end', () => {
        formData.file = Buffer.concat(fileBuffer);
      });
    });

    busboy.on('finish', () => {
      const { name, email, subject, message } = formData;

      const mailOptions = {
        from: email,
        to: 'palmabenavidesa650@gmail.com',
        subject: `Nuevo mensaje de contacto: ${subject}`,
        html: `
          <h2>Nuevo mensaje del formulario de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Mensaje:</strong> ${message}</p>
        `,
        attachments: fileName
          ? [
              {
                filename: fileName,
                content: formData.file,
                contentType: fileType,
              },
            ]
          : [],
      };

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'palmabenavidesa650@gmail.com',
          pass: 'Adrian1821', // Usar variables de entorno en producción
        },
      });

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar correo:', error);
          return reject({
            statusCode: 500,
            body: 'Error al enviar el correo.',
          });
        }

        resolve({
          statusCode: 200,
          body: 'Formulario enviado con éxito.',
        });
      });
    });

    busboy.end(body);
  });
};
