-- Seed example posts
-- Note: These reference bydel IDs dynamically

INSERT INTO posts (title, slug, excerpt, content, bydel_id, is_newsletter, is_published, published_at) VALUES
(
  'Prisvekst i Midtbyen: 8% oppgang siste kvartal',
  'prisvekst-midtbyen-q1-2026',
  'Midtbyen fortsetter å lede an i Trondheims boligmarked. Siste kvartal viser en oppgang på hele 8 prosent.',
  '## Sterk vekst i sentrum

Boligprisene i Midtbyen har steget med **8 prosent** det siste kvartalet, ifølge ferske tall fra Eiendom Norge.

### Drivere bak veksten

- **Nybygg ved Nyhavna**: Flere hundre nye leiligheter trekker interesse til området
- **Bedret infrastruktur**: Nye sykkelveier og grønne lunger gjør sentrum mer attraktivt
- **Økt etterspørsel**: Studenter og unge profesjonelle driver markedet

### Prisutvikling per boligtype

| Boligtype | Endring |
|-----------|---------|
| Leilighet | +9,2% |
| Rekkehus | +6,1% |
| Enebolig | +5,4% |

> «Vi ser en tydelig trend der folk ønsker å bo sentralt. Midtbyen er mer populær enn noensinne.» — Trondheim Eiendomsmegling

### Fremtidsutsikter

Analytikere forventer at veksten vil avta noe i neste kvartal, men at det fortsatt vil være et selgers marked i sentrumsområdene.',
  (SELECT id FROM bydeler WHERE slug = 'midtbyen'),
  true, true, NOW() - INTERVAL '2 days'
),
(
  'Nytt boligfelt på Lade: 200 nye boliger planlagt',
  'nytt-boligfelt-lade-2026',
  'Et stort nytt boligprosjekt er annonsert på Lade, med over 200 boliger fordelt på leiligheter og rekkehus.',
  '## Stor utbygging på Lade

Trondheim kommune har godkjent reguleringsplanen for det nye boligfeltet på Lade, som vil gi **200 nye boliger** i området.

### Prosjektdetaljer

- **Tidsramme**: Byggestart høsten 2026, ferdigstillelse 2028
- **Boligmiks**: 140 leiligheter og 60 rekkehus
- **Prisnivå**: Fra 3,2 millioner for de minste leilighetene
- **Fellesarealer**: Park, lekeplass og nærbutikk

### Hva betyr dette for området?

Utbyggingen vil styrke Lade som et attraktivt boområde. Nærheten til sjøen, Ladestien og gode bussforbindelser til sentrum gjør området populært.

### Markedseffekt

Eksisterende boliger i området har allerede sett en prisøkning på 3-4% siden planene ble offentliggjort.',
  (SELECT id FROM bydeler WHERE slug = 'lade'),
  true, true, NOW() - INTERVAL '5 days'
),
(
  'Byåsen: Familievennlig bydel med stabile priser',
  'byasen-stabile-priser-2026',
  'Byåsen holder seg som en av de mest ettertraktede bydelene for barnefamilier, med stabil prisutvikling.',
  '## Byåsen — trygt valg for familier

Byåsen fortsetter å tiltrekke barnefamilier med sine gode skoler, nærhet til marka og rolige bomiljø.

### Prisstabilitet

Til forskjell fra de mer volatile sentrumsområdene, har Byåsen vist en **jevn vekst på 4-5% årlig** de siste tre årene. Dette gjør bydelen til et trygt valg for langsiktige boliginvestorer.

### Populære områder

1. **Munkvoll** — Nær Bymarka, populært blant friluftsfolk
2. **Stavset** — Gode barnehager og skoler
3. **Flatåsen** — Rimeligere alternativ med god infrastruktur

### Tips til boligkjøpere

- Vurder eneboliger med utleiemulighet — stor etterspørsel fra studenter
- Sjekk kommunens planer for ny bybane som kan påvirke priser positivt
- Byåsen har generelt lavere felleskostnader enn sentrum',
  (SELECT id FROM bydeler WHERE slug = 'byasen'),
  true, true, NOW() - INTERVAL '8 days'
),
(
  'Tiller: Handelssenter i endring mot mer bolig',
  'tiller-handel-til-bolig-2026',
  'Tiller transformeres fra ren handelspark til en mer blandet bydel med nye boligprosjekter.',
  '## Fra handel til hybrid

Tiller-området, tradisjonelt kjent for sine kjøpesentre, er i ferd med å gjennomgå en stor transformasjon.

### Nye boligprosjekter

Tre nye boligprosjekter er under planlegging:

- **Tiller Terrasse**: 80 leiligheter med takterrasse
- **Heimdalsgata Park**: 45 rekkehus
- **Sentrum Tiller**: Kombinert handel- og boligkompleks

### Prisprediksjoner

Med den planlagte Metrobuss-utvidelsen til Tiller, forventer meglere en prisøkning på **6-8%** i løpet av de neste to årene.

> Tiller er den bydelen vi følger tettest akkurat nå. Potensialet er enormt.',
  (SELECT id FROM bydeler WHERE slug = 'tiller'),
  true, true, NOW() - INTERVAL '12 days'
),
(
  'Studentboligmarkedet på Moholt: Høy etterspørsel',
  'moholt-studentbolig-2026',
  'Moholt opplever rekordhøy etterspørsel etter studentboliger. Her er hva du trenger å vite.',
  '## Moholt under press

Med over 30 000 studenter i Trondheim er etterspørselen etter boliger rundt universitetet enorm.

### Nøkkeltall

- **Gjennomsnittspris leilighet**: 2,8 millioner (40 kvm)
- **Leiepris**: 8 500–12 000 kr/mnd
- **Omsetningshastighet**: 14 dager i snitt
- **Budkrig-frekvens**: 7 av 10 salg

### Investeringsmuligheter

Moholt-området byr på gode investeringsmuligheter for utleie. Med universitetets vekstplaner og nye forskningsparker i området, er det grunn til å tro at etterspørselen vil forbli høy.

### Dragvoll-korridoren

Området mellom Moholt og Dragvoll er spesielt interessant, med nye gang- og sykkelveier som knytter områdene tettere sammen.',
  (SELECT id FROM bydeler WHERE slug = 'moholt'),
  false, false, NULL
);
