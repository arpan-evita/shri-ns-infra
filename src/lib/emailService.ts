const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

interface EmailParams {
  name: string;
  email: string;
  phone: string;
  message?: string;
  subject?: string;
}

export const sendLeadEmail = async ({ name, email, phone, message, subject }: EmailParams) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Shri NS Infra Leads <onboarding@resend.dev>',
        to: ['info@shrinsinfra.com', 'shrinsinframarketing@gmail.com'],
        subject: subject || `New Lead: ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #c9a41d;">New Lead Captured</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999;">This email was sent automatically from your website lead form.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API Error:', errorData);
      return { success: false, error: errorData };
    }

    return { success: true };
  } catch (error) {
    console.error('Email Service Error:', error);
    return { success: false, error };
  }
};
