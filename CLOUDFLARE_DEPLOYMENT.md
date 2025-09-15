# Cloudflare Pages Deployment - Zwolle Bitcoinstad

## 📋 Overzicht
Deze website is geconfigureerd voor deployment op Cloudflare Pages met Static Forms functionaliteit voor het contactformulier.

## 🚀 Deployment Stappen

### 1. Cloudflare Pages Project Aanmaken
1. Ga naar [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigeer naar **Pages** in het linker menu
3. Klik op **Create a project**
4. Kies **Connect to Git** (GitHub/GitLab)
5. Selecteer je repository
6. Configureer build settings:
   - **Build command**: `echo "Static site - no build needed"`
   - **Build output directory**: `/` (root)
   - **Root directory**: `/` (root)

### 2. Environment Variables (Optioneel)
Voor email functionaliteit kun je environment variables toevoegen:
- `SENDGRID_API_KEY` - Voor SendGrid email service
- `MAILGUN_API_KEY` - Voor Mailgun email service
- `NOTIFICATION_EMAIL` - Email adres voor notificaties

### 3. Dependencies Installeren
Na deployment installeert Cloudflare automatisch de dependencies uit `package.json`:
```json
{
  "dependencies": {
    "@cloudflare/pages-plugin-static-forms": "^1.0.0"
  }
}
```

## 📧 Email Functionaliteit

### Huidige Setup
- **Form submissions** worden gelogd in Cloudflare Functions logs
- **Success page** toont bevestiging aan gebruiker
- **Form data** wordt gecaptured: naam, email, bericht

### Email Service Integratie Opties

#### Option 1: Cloudflare Email Workers
```javascript
// In functions/_middleware.js - voeg toe aan respondWith functie:
const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    personalizations: [{
      to: [{ email: 'info@zwollebitcoinstad.nl' }],
      subject: emailSubject
    }],
    from: { email: 'noreply@zwollebitcoinstad.nl' },
    content: [{ type: 'text/plain', value: emailBody }]
  })
});
```

#### Option 2: SendGrid API
```javascript
// Voeg toe aan functions/_middleware.js:
const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    personalizations: [{
      to: [{ email: 'info@zwollebitcoinstad.nl' }],
      subject: emailSubject
    }],
    from: { email: 'noreply@zwollebitcoinstad.nl' },
    content: [{ type: 'text/plain', value: emailBody }]
  })
});
```

#### Option 3: KV Storage (voor later verwerken)
```javascript
// Voeg toe aan functions/_middleware.js:
await env.CONTACT_FORMS.put(
  `submission-${Date.now()}`,
  JSON.stringify({ naam, email, bericht, timestamp: new Date().toISOString() })
);
```

## 🔧 Lokale Development

### Prerequisites
```bash
npm install -g wrangler
```

### Lokaal Testen
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
# of
wrangler pages dev .
```

### Deploy via CLI
```bash
# Deploy to Cloudflare Pages
npm run deploy
# of
wrangler pages deploy .
```

## 📝 Form Configuratie

### HTML Form
Het contactformulier gebruikt het `data-static-form-name="contact"` attribuut:
```html
<form data-static-form-name="contact">
  <input name="naam" type="text" required>
  <input name="email" type="email" required>
  <textarea name="bericht" required></textarea>
  <button type="submit">Verstuur</button>
</form>
```

### Middleware Handler
De `functions/_middleware.js` file handelt alle form submissions af en:
- Extraheert form data (naam, email, bericht)
- Logt submissions naar Cloudflare logs
- Toont success page met Nederlandse tekst
- Kan uitgebreid worden met email service

## 🔍 Monitoring & Logs

### Form Submissions Bekijken
1. Ga naar Cloudflare Dashboard → Pages → je project
2. Klik op **Functions** tab
3. Bekijk **Real-time Logs** voor form submissions

### Log Format
```javascript
{
  naam: "John Doe",
  email: "john@example.com", 
  bericht: "Hallo, ik heb een vraag...",
  timestamp: "2025-09-16T01:11:51.000Z",
  emailSubject: "Nieuw contactformulier bericht van John Doe",
  emailBody: "Nieuw bericht via het contactformulier..."
}
```

## ✅ Verificatie Checklist

Na deployment controleer:
- [ ] Website laadt correct op Cloudflare Pages URL
- [ ] Contactformulier is zichtbaar
- [ ] Form submission toont success page
- [ ] Form data verschijnt in Functions logs
- [ ] Custom domain (indien geconfigureerd) werkt
- [ ] SSL certificaat is actief
- [ ] Mobile menu werkt correct
- [ ] Carousel functionaliteit werkt

## 🆘 Troubleshooting

### Form werkt niet
- Controleer of `@cloudflare/pages-plugin-static-forms` is geïnstalleerd
- Verificeer `data-static-form-name` attribuut in HTML
- Check Functions logs voor errors

### Email wordt niet verzonden
- Voeg email service integratie toe (zie opties hierboven)
- Configureer environment variables
- Test email service API keys

### Build fails
- Controleer `package.json` syntax
- Verificeer build command in Cloudflare Pages settings

## 📞 Support
Voor vragen over deze setup:
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Static Forms Plugin: https://developers.cloudflare.com/pages/plugins/static-forms/
