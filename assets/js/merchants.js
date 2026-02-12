const MERCHANTS = [
  { name: "'t Pannenkoekschip", type: 'Eten & drinken', url: 'https://www.pannenkoekschipzwolle.nl/' },
  { name: 'Smooth Fruit Therapy', type: 'Retail', url: 'https://www.smoothfruittherapy.nl/' },
  { name: 'Spar (NS Station)', type: 'Retail', url: 'https://www.spar.nl/winkels/spar-city-lubeckplein-147/' },
  { name: 'Purazen Gym', type: 'Dienst', url: 'https://www.purazengym.nl/' },
  { name: 'Cafetaria Het Eethuys', type: 'Eten & drinken', url: 'https://www.hetweeshuys.nl/het-eethuys-afhaal' },
  { name: 'Het Weeshuys', type: 'Eten & drinken', url: 'https://www.hetweeshuys.nl/' },
  { name: 'Meneer Jan', type: 'Eten & drinken', url: 'https://www.meneer-jan.nl/' },
  { name: 'De Enk', type: 'Eten & drinken', url: 'https://www.golfclubzwolle.nl/de-enk/' },
  { name: 'Steakhouse Amigo', type: 'Eten & drinken', url: 'https://www.steakhouseamigo.nl/' },
  { name: 'Blue Sakura', type: 'Eten & drinken', url: 'https://www.bluesakura.nl/zwolle/' },
  { name: 'De Stadshoeve', type: 'Eten & drinken', url: 'https://www.destadshoeve.nl/' },
  { name: 'La Cucaracha', type: 'Eten & drinken', url: 'https://www.lacucaracha.nl/' },
  { name: 'Het Vliegende Paard', type: 'Eten & drinken', url: 'https://www.cafehetvliegendepaard.nl/' },
  { name: 'Anycoin Direct', type: 'Dienst', url: 'https://anycoindirect.eu/' }
];

const merchantGrid = document.getElementById('merchant-grid');
const merchantCount = document.getElementById('merchant-count');

if (merchantGrid) {
  MERCHANTS.forEach((merchant) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = merchant.url;
    link.target = '_blank';
    link.rel = 'noopener';

    link.innerHTML = `<span class="business-name">${merchant.name}</span><span class="business-type">${merchant.type}</span>`;
    item.appendChild(link);
    merchantGrid.appendChild(item);
  });

  const addItem = document.createElement('li');
  addItem.className = 'dummy-business-card';
  addItem.innerHTML = '<a href="#contact"><span class="business-name">Voeg je zaak toe</span><span class="business-type">Neem contact op met de community</span></a>';
  merchantGrid.appendChild(addItem);
}

if (merchantCount) {
  merchantCount.textContent = MERCHANTS.length;
}
