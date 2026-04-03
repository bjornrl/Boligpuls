# Instruksjoner for HTML-rapporter

## Krav til HTML-filen

HTML-filen som lastes opp i Sanity vil vises direkte inne i nettsiden (ikke i en egen ramme). Nettsiden legger automatisk til responsiv styling, men det er viktig at HTML-filen følger disse reglene for best mulig resultat.

### Obligatorisk

1. **Standard HTML-struktur** — Filen må starte med `<!DOCTYPE html>` og inneholde `<html>`, `<head>` og `<body>`.

2. **Charset** — Inkluder `<meta charset="utf-8">` i `<head>` for å sikre at norske tegn (æ, ø, å) vises riktig.

3. **Ingen JavaScript** — Filen skal ikke inneholde `<script>`-tagger. Disse blir blokkert av nettsiden av sikkerhetsgrunner.

### Anbefalt for mobilvennlighet

4. **Unngå hardkodede bredder over 600px** — Bruk `width="100%"` eller `max-width: 600px` i stedet for `width="600"` på tabeller og containere. Nettsiden prøver å fikse dette automatisk, men det er bedre å gjøre det riktig fra starten.

5. **Bilder bør ha `max-width: 100%`** — Legg til `style="max-width: 100%; height: auto;"` på alle `<img>`-tagger så de skalerer på mobil.

6. **Bruk tabellbasert layout med forsiktighet** — Hvis du bruker `<table>` for layout (vanlig i e-postmaler), sørg for at hver celle kan stables vertikalt på små skjermer. Unngå side-ved-side kolonner som krever minimum 600px bredde.

7. **Inline CSS** — All styling bør være inline (via `style="..."` attributter) eller i en `<style>`-tagg i `<head>`. Eksterne CSS-filer (via `<link>`) vil ikke lastes.

### Ikke inkluder

- **Header/navigasjon** — Nettsiden legger til sin egen header, tittel, rapporttype-badge og dato automatisk.
- **Footer med avmeldings-lenker** — Nettsiden har sin egen footer. Avmeldings-lenker er kun relevant for e-post, ikke for nettsiden.
- **Bakgrunnsfarge på `<body>`** — Nettsiden setter sin egen bakgrunn. Hvis filen har bakgrunnsfarge på body, kan det se rart ut.

## Eksempel på minimal HTML-fil

```html
<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td style="padding: 16px;">
        <h2 style="color: #002D32; font-size: 22px;">Overskrift</h2>
        <p style="color: #1A1A1A; line-height: 1.7; font-size: 15px;">
          Brødtekst her...
        </p>
        <img src="https://..." alt="Beskrivelse" style="max-width: 100%; height: auto;">
      </td>
    </tr>
  </table>
</body>
</html>
```

## Opplasting i Sanity

1. Gå til Sanity Studio
2. Opprett nytt innlegg eller rediger eksisterende
3. Velg **Innholdstype: HTML**
4. Last opp filen via "Last opp HTML-fil" eller lim inn HTML i tekstfeltet
5. Bruk "Vis forhåndsvisning" for å sjekke at det ser riktig ut
6. Fyll ut tittel, rapporttype, periode og sammendrag
7. Publiser
