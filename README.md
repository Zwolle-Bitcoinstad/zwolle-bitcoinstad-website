# Zwolle Bitcoinstad Website

Een moderne website voor de Bitcoin community in Zwolle, Nederland.

## 📋 Over dit Project

Deze website is gebouwd voor Zwolle Bitcoinstad, een lokale Bitcoin community die regelmatig meetups organiseert en Bitcoin-accepterende ondernemers in de regio promoot.

## 🚀 Features

- **Responsive Design** - Werkt op alle apparaten
- **Geoptimaliseerde Performance** - 51% CSS size reductie
- **Contactformulier** - Met Cloudflare Pages Static Forms
- **Bitcoin Meetup Info** - Evenement details en aanmeldingen
- **Ondernemer Directory** - Bitcoin-accepterende bedrijven in Zwolle
- **Image Carousel** - Foto's van Bitcoin meetups

## 🛠️ Tech Stack

- **HTML5** - Semantische markup
- **CSS3** - Modern CSS, geoptimaliseerd met UnCSS
- **Vanilla JavaScript** - Lightweight functionaliteit
- **Cloudflare Pages** - Hosting en Functions
- **WebP Images** - Geoptimaliseerde afbeeldingen

## 📁 Project Structure

```
├── index.html                 # Hoofdpagina
├── package.json              # Dependencies
├── functions/
│   └── _middleware.js        # Contactformulier handler
├── assets/
│   ├── css/
│   │   └── style.css         # Geoptimaliseerde CSS
│   ├── images/               # WebP afbeeldingen
│   ├── js/
│   │   ├── mobile-menu.js    # Mobile menu
│   │   └── simple-carousel.js # Image carousel
│   ├── fonts/                # Web fonts
│   └── svg/                  # SVG icons
└── CLOUDFLARE_DEPLOYMENT.md  # Deployment guide
```

## 🚀 Development

### Prerequisites
- Node.js (voor Cloudflare Pages development)
- Git

### Local Development
```bash
# Clone repository
git clone https://github.com/Zwolle-Bitcoinstad/zwolle-bitcoinstad-website.git
cd zwolle-bitcoinstad-website

# Install dependencies
npm install

# Start development server
npm run dev
```

### Deployment
Deze website is geconfigureerd voor Cloudflare Pages. Zie `CLOUDFLARE_DEPLOYMENT.md` voor uitgebreide instructies.

## 📧 Contactformulier

Het contactformulier gebruikt Cloudflare Pages Static Forms:
- Form submissions worden gelogd in Cloudflare Functions
- Nederlandse success page
- Uitbreidbaar met email services (SendGrid, MailChannels)

## 📞 Contact

- **Website**: [zwollebitcoinstad.nl](https://zwollebitcoinstad.nl)
- **Telegram**: [@zwollebitcoinstad](https://t.me/zwollebitcoinstad)
- **LinkedIn**: [Zwolle Bitcoinstad](https://www.linkedin.com/company/zwollebitcoinstad)

## � License

MIT License - zie [LICENSE](LICENSE) voor details.
