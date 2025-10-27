import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// Configurar transporter de nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: process.env.EMAIL_SERVER_PORT === '465', // true para 465 (SSL), false para 587 (STARTTLS)
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { activityId, receiverId, subject, content } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    let recipientId: string;
    let recipientData: any;
    let activity: any = null;

    // Si se proporciona receiverId, es una respuesta directa (empresa → padre)
    if (receiverId) {
      recipientId = receiverId;
      
      // Obtener datos del receptor
      recipientData = await prisma.user.findUnique({
        where: { id: receiverId },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      // Si hay activityId, obtener datos de la actividad
      if (activityId) {
        activity = await prisma.activity.findUnique({
          where: { id: activityId },
          select: {
            id: true,
            title: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        });
      }
    } else if (activityId) {
      // Es un mensaje inicial de padre a empresa
      activity = await prisma.activity.findUnique({
        where: { id: activityId },
        include: {
          company: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!activity) {
        return NextResponse.json(
          { error: 'Actividad no encontrada' },
          { status: 404 }
        );
      }

      recipientId = activity.company.userId;
      recipientData = activity.company.user;
    } else {
      return NextResponse.json(
        { error: 'Debe proporcionar receiverId o activityId' },
        { status: 400 }
      );
    }

    if (!recipientData) {
      return NextResponse.json(
        { error: 'Receptor no encontrado' },
        { status: 404 }
      );
    }

    // Crear el mensaje en la base de datos
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId: recipientId,
        activityId: activityId || null,
        subject: subject,
        content: content,
        read: false,
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Enviar notificación por email
    try {
      const isCompanyToParent = session.user.role === 'COMPANY';
      const recipientName = recipientData.name || 'Usuario';
      const senderName = message.sender.name || 'Usuario';
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f43f5e 0%, #be123c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f43f5e; }
            .button { display: inline-block; background: #f43f5e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📩 ${isCompanyToParent ? 'Nueva Respuesta Recibida' : 'Nuevo Mensaje Recibido'}</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${recipientName}</strong>,</p>
              <p>${isCompanyToParent 
                ? `Has recibido una respuesta de <strong>${activity?.company?.name || 'la empresa'}</strong> a través de ExtraSchools:` 
                : `Has recibido un nuevo mensaje a través de ExtraSchools${activity ? ` sobre tu actividad <strong>${activity.title}</strong>` : ''}:`
              }</p>
              
              <div class="message-box">
                ${activity ? `<p><strong>Actividad:</strong> ${activity.title}</p>` : ''}
                <p><strong>De:</strong> ${senderName} (${message.sender.email})</p>
                <p><strong>Asunto:</strong> ${subject}</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;">
                <p><strong>Mensaje:</strong></p>
                <p style="white-space: pre-line;">${content}</p>
              </div>

              <p>Puedes responder directamente a este mensaje o acceder a tu panel para gestionar tus mensajes:</p>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/${isCompanyToParent ? 'messages' : 'company/messages'}" class="button">
                  Ver Mensaje en Panel
                </a>
              </div>

              ${!isCompanyToParent ? `
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                  <strong>💡 Consejo:</strong> Responde lo antes posible para aumentar tus posibilidades de conseguir nuevos clientes.
                </p>
              ` : ''}
            </div>
            <div class="footer">
              <p>Este email fue enviado desde ExtraSchools</p>
              <p>${process.env.NEXT_PUBLIC_APP_URL}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"ExtraSchools" <${process.env.EMAIL_FROM}>`,
        to: recipientData.email,
        subject: `📩 ${isCompanyToParent ? 'Nueva respuesta' : 'Nuevo mensaje'}${activity ? ` sobre "${activity.title}"` : ''}`,
        html: emailHtml,
        replyTo: message.sender.email,
      });

      console.log('✅ Email de notificación enviado a:', recipientData.email);
    } catch (emailError) {
      console.error('❌ Error al enviar email:', emailError);
      // No fallar la request si el email falla, el mensaje ya está en la BD
    }

    return NextResponse.json({
      success: true,
      message: message,
    });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    );
  }
}

// GET - Obtener mensajes del usuario
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'sent' | 'received' | 'count'

    // Si solo quieren el contador de no leídos
    if (type === 'count') {
      const unreadCount = await prisma.message.count({
        where: {
          receiverId: session.user.id,
          read: false,
        },
      });

      return NextResponse.json({ unreadCount });
    }

    let messages;

    if (type === 'sent') {
      messages = await prisma.message.findMany({
        where: { senderId: session.user.id },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          activity: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      messages = await prisma.message.findMany({
        where: { receiverId: session.user.id },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          activity: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    return NextResponse.json(
      { error: 'Error al obtener mensajes' },
      { status: 500 }
    );
  }
}

// PATCH - Marcar mensaje como leído
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { messageId, read } = body;

    if (!messageId) {
      return NextResponse.json(
        { error: 'ID de mensaje requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario es el receptor
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: 'Mensaje no encontrado o sin permisos' },
        { status: 404 }
      );
    }

    // Actualizar estado
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { read: read ?? true },
    });

    return NextResponse.json({
      success: true,
      message: updatedMessage,
    });
  } catch (error) {
    console.error('Error al actualizar mensaje:', error);
    return NextResponse.json(
      { error: 'Error al actualizar mensaje' },
      { status: 500 }
    );
  }
}
