import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  await transporter.sendMail({
    from: `"Oficina Mecânica" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

// ─── Templates ───────────────────────────────────────────────────────────────

export function emailOrcamentoDisponivel(clienteName: string, osId: number, budget: number, appUrl: string) {
  const approveUrl = `${appUrl}/service-order/${osId}/approve`;
  const rejectUrl  = `${appUrl}/service-order/${osId}/reject`;

  return {
    subject: `[OS #${osId}] Orçamento disponível para aprovação`,
    html: `
      <h2>Olá, ${clienteName}!</h2>
      <p>O diagnóstico da sua ordem de serviço <strong>#${osId}</strong> foi concluído.</p>
      <p><strong>Valor do orçamento: R$ ${budget.toFixed(2)}</strong></p>
      <p>Para aprovar ou recusar, clique nos botões abaixo:</p>
      <p>
        <a href="${approveUrl}" style="background:#16a34a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;margin-right:12px">
          ✅ Aprovar orçamento
        </a>
        <a href="${rejectUrl}" style="background:#dc2626;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">
          ❌ Recusar orçamento
        </a>
      </p>
      <p style="color:#6b7280;font-size:12px">
        Ou acesse diretamente:<br/>
        Aprovar: ${approveUrl}<br/>
        Recusar: ${rejectUrl}
      </p>
    `,
  };
}

export function emailStatusAtualizado(clienteName: string, osId: number, status: string) {
  const statusLabels: Record<string, string> = {
    RECEBIDA:             "Recebida — aguardando mecânico",
    DIAGNOSTICO:          "Em diagnóstico",
    AGUARDANDO_APROVACAO: "Aguardando sua aprovação de orçamento",
    EXECUCAO:             "Em execução",
    FINALIZADA:           "Finalizada — aguardando retirada",
    ENTREGUE:             "Entregue",
  };

  return {
    subject: `[OS #${osId}] Status atualizado: ${statusLabels[status] ?? status}`,
    html: `
      <h2>Olá, ${clienteName}!</h2>
      <p>Sua ordem de serviço <strong>#${osId}</strong> teve o status atualizado para:</p>
      <p style="font-size:18px;font-weight:bold;color:#1d4ed8">${statusLabels[status] ?? status}</p>
      <p>Em caso de dúvidas, entre em contato com a oficina.</p>
    `,
  };
}