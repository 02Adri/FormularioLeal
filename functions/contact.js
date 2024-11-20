const Busboy =require('busboy');  // Importar busboy
const nodemailer = require('nodemailer');

export const handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    if (event.httpMethod !== 'POST') {
      return resolve({
        statusCode: 405,
        body: 'Método no permitido',
      });
    }

    // Decodificar el cuerpo si es necesario
    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('binary')
      : event.body;

    // Crear la instancia de Busboy correctamente
    const busboy = new Busboy({ headers: event.headers });

    const formData = {};
    let fileBuffer = [];
    let fileName, fileType;

    // Procesar los campos del formulario
    busboy.on('field', (fieldname, val) => {
      formData[fieldname] = val;
    });

    // Procesar los archivos cargados
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

    // Una vez que se haya procesado el formulario
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

      // Configuración de Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'palmabenavidesa650@gmail.com',
          pass: 'Adrian1821', // Usa variables de entorno para contraseñas en producción
        },
      });

      // Enviar el correo
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

    // Iniciar el procesamiento con busboy
    busboy.end(body);
  });
};
