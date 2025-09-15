export async function onRequestPost(context) {
  const { request } = context;
  
  try {
    // Parse form data
    const formData = await request.formData();
    const naam = formData.get("naam");
    const email = formData.get("email");
    const bericht = formData.get("bericht");
    
    // Validate required fields
    if (!naam || !email || !bericht) {
      return new Response('Alle velden zijn verplicht', { status: 400 });
    }
    
    // Create email content for logging/future email service
    const emailSubject = `Nieuw contactformulier bericht van ${naam}`;
    const emailBody = `
Nieuw bericht via het contactformulier van Zwolle Bitcoinstad:

Van: ${naam}
Email: ${email}

Bericht:
${bericht}

---
Dit bericht is verzonden via het contactformulier op zwollebitcoinstad.nl
Verzonden op: ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}
    `.trim();

    // Log the form submission (visible in Cloudflare Pages Functions logs)
    console.log('Contact form submission:', {
      naam,
      email,
      bericht,
      timestamp: new Date().toISOString(),
      emailSubject,
      emailBody
    });

    // Here you can add email sending logic:
    // - Cloudflare Email Workers: https://developers.cloudflare.com/email-routing/email-workers/
    // - SendGrid API: https://sendgrid.com/docs/api-reference/
    // - Mailgun API: https://documentation.mailgun.com/en/latest/api_reference.html
    // - Or save to KV storage: https://developers.cloudflare.com/workers/runtime-apis/kv/

    // Return success response with Dutch text
    return new Response(`
      <!DOCTYPE html>
      <html lang="nl-NL">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Bericht verzonden - Zwolle Bitcoinstad</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
          }
          .success-icon {
            font-size: 48px;
            color: #28a745;
            margin-bottom: 20px;
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 15px;
          }
          .back-link {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background-color: #ff6b35;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
          }
          .back-link:hover {
            background-color: #e55a2b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✅</div>
          <h1>Bedankt voor je bericht!</h1>
          <p>Hallo <strong>${naam}</strong>,</p>
          <p>Je bericht is succesvol verzonden. We nemen zo snel mogelijk contact met je op via <strong>${email}</strong>.</p>
          <p>In de tussentijd kun je ook lid worden van onze <a href="https://t.me/zwollebitcoinstad" target="_blank">Telegram groep</a> voor dagelijkse Bitcoin discussies!</p>
          <a href="/" class="back-link">← Terug naar de website</a>
        </div>
      </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
    
  } catch (error) {
    console.error('Form submission error:', error);
    return new Response('Er is een fout opgetreden bij het verzenden van je bericht', { status: 500 });
  }
}
