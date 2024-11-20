import nodemailer from 'nodemailer';
import Busboy from 'busboy';

export const handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    if (event.httpMethod !== 'POST') {
      return resolve({
        statusCode: 405,
        body: 'Método no permitido',
      });
    }

    // Manejar el cuerpo base64 si es necesario
    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : event.body;

    // Instanciar Busboy
    const busboy = new Busboy({ headers: event.headers });
    const formData = {};
    let fileBuffer = [];
    let fileName, fileType;

    // Procesar campos de formulario
    busboy.on('field', (fieldname, val) => {
      formData[fieldname] = val;
    });

    // Procesar archivos
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

    // Finalizar procesamiento
    busboy.on('finish', () => {
      const { name, email, subject, message } = formData;

      // Opciones de correo
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

      // Configurar transporte de correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'palmabenavidesa650@gmail.com',
          pass: 'Adrian1821', // Usa variables de entorno para mayor seguridad
        },
      });

      // Enviar correo
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

    // Pasar cuerpo a Busboy
    busboy.end(body);
  });
};
