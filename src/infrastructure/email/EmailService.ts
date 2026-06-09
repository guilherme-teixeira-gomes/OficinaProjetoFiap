import nodemailer from 'nodemailer';

// Configuração do transporter
// Para desenvolvimento/teste, você pode usar o Ethereal (email falso)
// Para produção, configure com seu provedor (Gmail, SendGrid, Amazon SES, etc.)

let transporter: nodemailer.Transporter;

// Função para inicializar o transporter
export function initEmailService() {
  // Se estiver em ambiente de desenvolvimento/teste e não tiver SMTP configurado
  if (process.env.NODE_ENV === 'test' || !process.env.SMTP_HOST) {
    // Cria um transporter mock para testes
    transporter = {
      sendMail: async (mailOptions: any) => {
        console.log('📧 [EMAIL MOCK] Enviando email para:', mailOptions.to);
        console.log('📧 Assunto:', mailOptions.subject);
        console.log('📧 Corpo:', mailOptions.text);
        return { messageId: 'mock-message-id-' + Date.now() };
      }
    } as nodemailer.Transporter;
    return;
  }

  // Configuração real com SMTP
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outras portas
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Função para enviar email de atualização de status
export async function sendStatusEmail(
  to: string,
  orderId: number,
  status: string
): Promise<boolean> {
  try {
    // Garantir que o transporter está inicializado
    if (!transporter) {
      initEmailService();
    }

    // Mapeamento de status para mensagens amigáveis
    const statusMessages: Record<string, string> = {
      'RECEBIDA': 'recebida e aguardando um mecânico',
      'EM_DIAGNOSTICO': 'em diagnóstico - um mecânico está analisando seu veículo',
      'AGUARDANDO_APROVACAO': 'aguardando sua aprovação - por favor, acesse o sistema para ver o orçamento',
      'EM_EXECUCAO': 'em execução - os serviços estão sendo realizados',
      'FINALIZADA': 'finalizada - os serviços foram concluídos',
      'ENTREGUE': 'entregue - veículo liberado',
      'CANCELADA': 'cancelada - o orçamento foi recusado'
    };

    const statusText = statusMessages[status] || status;
    const companyName = process.env.COMPANY_NAME || 'Oficina Mecânica';

    const mailOptions = {
      from: `"${companyName}" <${process.env.SMTP_FROM || 'no-reply@oficina.com'}>`,
      to,
      subject: `🔧 Ordem de Serviço #${orderId} - Status atualizado`,
      text: `
Olá!

A ordem de serviço #${orderId} está com status: ${status.toUpperCase()}

Status: ${statusText}

Data: ${new Date().toLocaleString('pt-BR')}

Para mais detalhes, acesse o sistema.

Atenciosamente,
${companyName}
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f3f4f6; }
    .status { 
      display: inline-block; 
      padding: 10px 20px; 
      border-radius: 8px; 
      font-weight: bold;
      margin: 10px 0;
    }
    .status-RECEBIDA { background-color: #9ca3af; color: white; }
    .status-EM_DIAGNOSTICO { background-color: #3b82f6; color: white; }
    .status-AGUARDANDO_APROVACAO { background-color: #eab308; color: white; }
    .status-EM_EXECUCAO { background-color: #8b5cf6; color: white; }
    .status-FINALIZADA { background-color: #10b981; color: white; }
    .status-ENTREGUE { background-color: #059669; color: white; }
    .status-CANCELADA { background-color: #ef4444; color: white; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
    .button {
      background-color: #2563eb;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛠️ ${companyName}</h1>
    </div>
    <div class="content">
      <h2>Atualização da Ordem de Serviço #${orderId}</h2>
      <p>Sua OS foi atualizada para o status:</p>
      <div class="status status-${status}">
        <strong>${status}</strong>
      </div>
      <p><strong>${statusText}</strong></p>
      <p>Data da atualização: ${new Date().toLocaleString('pt-BR')}</p>
      <a href="${process.env.APP_URL || 'http://localhost:3000'}/service-order/${orderId}" class="button">
        📋 Ver detalhes da OS
      </a>
    </div>
    <div class="footer">
      <p>Este é um email automático, por favor não responda.</p>
      <p>© ${new Date().getFullYear()} ${companyName} - Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email enviado para ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return false;
  }
}

// Função para enviar email de boas-vindas (opcional)
export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  try {
    if (!transporter) {
      initEmailService();
    }

    const mailOptions = {
      from: `"Oficina Mecânica" <${process.env.SMTP_FROM || 'no-reply@oficina.com'}>`,
      to,
      subject: 'Bem-vindo à Oficina Mecânica',
      text: `
Olá ${name}!

Bem-vindo à Oficina Mecânica. Agora você pode acompanhar suas ordens de serviço online.

Acesse o sistema para ver nossos serviços.

Atenciosamente,
Oficina Mecânica
      `,
      html: `
<div style="font-family: Arial, sans-serif;">
  <h2>Bem-vindo, ${name}!</h2>
  <p>Estamos felizes em tê-lo conosco.</p>
  <p>Agora você pode acompanhar suas ordens de serviço online.</p>
  <a href="${process.env.APP_URL || 'http://localhost:3000'}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
    Acessar Sistema
  </a>
</div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
    return false;
  }
}

// Função para enviar email de orçamento (opcional)
export async function sendBudgetEmail(
  to: string,
  orderId: number,
  budget: number,
  items: any[]
): Promise<boolean> {
  try {
    if (!transporter) {
      initEmailService();
    }

    const itemsList = items.map(item => 
      `- ${item.title}: R$ ${item.total.toFixed(2)}`
    ).join('\n');

    const mailOptions = {
      from: `"Oficina Mecânica" <${process.env.SMTP_FROM || 'no-reply@oficina.com'}>`,
      to,
      subject: `📊 Orçamento da OS #${orderId}`,
      text: `
Olá!

Segue o orçamento da sua ordem de serviço #${orderId}:

Itens:
${itemsList}

Total: R$ ${budget.toFixed(2)}

Acesse o sistema para aprovar ou recusar o orçamento.

Atenciosamente,
Oficina Mecânica
      `,
      html: `
<div style="font-family: Arial, sans-serif;">
  <h2>Orçamento da OS #${orderId}</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr style="background-color: #f3f4f6;">
      <th style="padding: 10px; text-align: left;">Item</th>
      <th style="padding: 10px; text-align: right;">Valor</th>
    </tr>
    ${items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.title}</td>
        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">R$ ${item.total.toFixed(2)}</td>
      </tr>
    `).join('')}
    <tr style="background-color: #f3f4f6; font-weight: bold;">
      <td style="padding: 10px;">TOTAL</td>
      <td style="padding: 10px; text-align: right;">R$ ${budget.toFixed(2)}</td>
    </tr>
  </table>
  <div style="margin-top: 20px;">
    <a href="${process.env.APP_URL || 'http://localhost:3000'}/service-order/${orderId}" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">
      ✅ Aprovar
    </a>
    <a href="${process.env.APP_URL || 'http://localhost:3000'}/service-order/${orderId}/reject" style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      ❌ Recusar
    </a>
  </div>
</div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de orçamento:', error);
    return false;
  }
}

// Inicializa o serviço de email
initEmailService();