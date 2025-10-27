// Script de prueba para verificar configuración SMTP de Zoho
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('📧 PROBANDO CONFIGURACIÓN SMTP DE ZOHO\n');
console.log('Configuración actual:');
console.log('- Host:', process.env.EMAIL_SERVER_HOST);
console.log('- Port:', process.env.EMAIL_SERVER_PORT);
console.log('- User:', process.env.EMAIL_SERVER_USER);
console.log('- From:', process.env.EMAIL_FROM);
console.log('- Password:', process.env.EMAIL_SERVER_PASSWORD ? '***configurado***' : '❌ NO CONFIGURADO');
console.log('\n-----------------------------------\n');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_PORT === '465', // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  debug: true, // Mostrar logs detallados
  logger: true, // Mostrar información de conexión
});

async function testEmail() {
  try {
    console.log('🚀 Verificando conexión SMTP...\n');
    
    // Verificar conexión
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada correctamente!\n');
    
    console.log('📨 Enviando email de prueba...\n');
    
    // Enviar email de prueba
    const info = await transporter.sendMail({
      from: `"ExtraSchools Test" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_SERVER_USER, // Te envía el email a ti mismo
      subject: '✅ Test ExtraSchools - Sistema de Mensajes',
      text: 'Si ves este mensaje, ¡el sistema de emails funciona correctamente!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .success { background: #10b981; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ ¡Test Exitoso!</h1>
              </div>
              <div class="content">
                <div class="success">
                  <strong>El sistema de emails de ExtraSchools funciona correctamente</strong>
                </div>
                <p>Hola,</p>
                <p>Este es un email de prueba del sistema de mensajería de ExtraSchools.</p>
                <p><strong>Configuración probada:</strong></p>
                <ul>
                  <li>Host: ${process.env.EMAIL_SERVER_HOST}</li>
                  <li>Puerto: ${process.env.EMAIL_SERVER_PORT}</li>
                  <li>Usuario: ${process.env.EMAIL_SERVER_USER}</li>
                </ul>
                <p>Si recibes este email, significa que:</p>
                <ul>
                  <li>✅ La configuración SMTP es correcta</li>
                  <li>✅ Las credenciales de Zoho funcionan</li>
                  <li>✅ Los emails se pueden enviar correctamente</li>
                  <li>✅ El sistema de mensajes está listo para usar</li>
                </ul>
                <hr>
                <p style="color: #6b7280; font-size: 12px; text-align: center;">
                  ExtraSchools - Marketplace de Actividades Extraescolares<br>
                  Este es un email automático de prueba
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ ¡EMAIL ENVIADO EXITOSAMENTE!\n');
    console.log('📋 Detalles:');
    console.log('- Message ID:', info.messageId);
    console.log('- Response:', info.response);
    console.log('\n🎉 TODO FUNCIONA CORRECTAMENTE');
    console.log('Revisa tu bandeja de entrada de:', process.env.EMAIL_SERVER_USER);
    
  } catch (error) {
    console.error('\n❌ ERROR AL ENVIAR EMAIL:\n');
    console.error('Mensaje:', error.message);
    
    // Ayuda según el tipo de error
    if (error.message.includes('Invalid login')) {
      console.error('\n💡 SOLUCIÓN: Credenciales incorrectas');
      console.error('   - Verifica que el App Password de Zoho sea correcto');
      console.error('   - Genera un nuevo App Password en https://accounts.zoho.eu/home');
    } else if (error.message.includes('ECONNECTION') || error.message.includes('timeout')) {
      console.error('\n💡 SOLUCIÓN: Problema de conexión');
      console.error('   - Verifica que el host sea: smtppro.zoho.eu');
      console.error('   - Prueba cambiar el puerto a 587 en lugar de 465');
    } else if (error.message.includes('self signed certificate')) {
      console.error('\n💡 SOLUCIÓN: Problema de certificado SSL');
      console.error('   - Prueba con puerto 587 (STARTTLS) en lugar de 465');
    }
    
    console.error('\n📝 Configuración actual en .env:');
    console.error('EMAIL_SERVER_HOST="smtppro.zoho.eu"');
    console.error('EMAIL_SERVER_PORT="465" (prueba con "587")');
    console.error('EMAIL_SERVER_USER="info@extraschools.com"');
    console.error('EMAIL_SERVER_PASSWORD="tu_app_password_aqui"');
  }
}

testEmail();
