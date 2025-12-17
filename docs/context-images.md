# Afbeeldingen - werkwijze

- Opslag: plaats beelden in `assets/images/`.
- Formaat: gebruik WebP varianten met vaste breedtes; naamgeving `<slug>-200w.webp`, `<slug>-300w.webp` (extra maten als nodig), behoud eventueel de aangeleverde bron (png/jpg) voor hergebruik.
- Optimalisatie: converteer naar WebP met kwaliteit ~85 en behoud aspect ratio. Voorbeeld met Pillow:
  ```bash
  python - <<'PY'
  from pathlib import Path
  from PIL import Image
  src = Path("assets/images/bron.png")
  img = Image.open(src).convert("RGBA")
  for w in (200, 300):
      h = round(img.height * w / img.width)
      out = src.with_name(f"{src.stem}-{w}w.webp")
      img.resize((w, h), Image.LANCZOS).save(out, format="WEBP", quality=85, method=6)
  PY
  ```
- Gebruik in de galerij: `<img>` met `width`/`height`, `class="image layout-inner css-filter"`, `alt` beschrijving, `decoding="async"`, `srcset` met de beschikbare breedtes en `sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 300px"` (pas breedte/sizes aan als de basisbreedte afwijkt).
- Link structuur: beeld staat binnen `<a href="...">` naar de site van de ondernemer; onder het beeld een `<figcaption>` met de naam.

Voorbeeld (300px basis):
```html
<li class="layout-item" data-id="XYZ">
  <figure>
    <a href="https://voorbeeld.nl/" target="_blank">
      <img width="300" height="200"
           src="assets/images/voorbeeld-300w.webp"
           class="image layout-inner css-filter"
           alt="Voorbeeld Ondernemer - locatie"
           decoding="async"
           srcset="assets/images/voorbeeld-200w.webp 200w, assets/images/voorbeeld-300w.webp 300w"
           sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 300px">
    </a>
    <figcaption class="image-caption">Voorbeeld Ondernemer</figcaption>
  </figure>
}
```
