import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'p7x7ccrx',
  dataset: 'production',
  apiVersion: '2026-03-14',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const bydeler = [
  { name: 'Midtbyen', slug: 'midtbyen', emoji: '🏛', color: '#D7B180' },
  { name: 'Lade & Strindheim', slug: 'lade', emoji: '🌳', color: '#155356' },
  { name: 'Byåsen', slug: 'byasen', emoji: '⛷', color: '#3D6E99' },
  { name: 'Tiller & Heimdal', slug: 'tiller', emoji: '🏘', color: '#B8860B' },
  { name: 'Moholt & Dragvoll', slug: 'moholt', emoji: '🎓', color: '#7B5EA7' },
  { name: 'Saupstad & Kolstad', slug: 'saupstad', emoji: '🏡', color: '#8B5E6B' },
  { name: 'Ranheim & Charlottenlund', slug: 'ranheim', emoji: '🌊', color: '#2E8E8E' },
  { name: 'Jakobsli & Vikåsen', slug: 'jakobsli', emoji: '🌄', color: '#9E7B5A' },
]

const siteSettings = {
  _type: 'siteSettings',
  _id: 'siteSettings',
  heroTitle: 'Boligmarkedet i Trondheim',
  heroSubtitle: 'Hold deg oppdatert på boligmarkedet i din bydel. Få ukentlige eller månedlige oppdateringer rett i innboksen.',
  aboutText: 'Boligpuls leverer nyhetsbrev om boligmarkedet i Trondheims bydeler.',
  seoTitle: 'Boligpuls Trondheim — Nyhetsbrev om boligmarkedet',
  seoDescription: 'Hold deg oppdatert på boligmarkedet i Trondheim. Få nyhetsbrev segmentert etter bydel.',
}

async function seed() {
  console.log('Seeding bydeler...')
  for (const b of bydeler) {
    const doc = {
      _type: 'bydel',
      _id: `bydel-${b.slug}`,
      name: b.name,
      slug: { _type: 'slug', current: b.slug },
      emoji: b.emoji,
      color: b.color,
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ ${b.emoji} ${b.name}`)
  }

  console.log('\nSeeding site settings...')
  await client.createOrReplace(siteSettings)
  console.log('  ✓ Site settings')

  console.log('\nSeeding example posts...')
  const posts = [
    {
      _type: 'post',
      _id: 'post-prisvekst-midtbyen',
      title: 'Sterk prisvekst i Midtbyen — 8,2% siste kvartal',
      slug: { _type: 'slug', current: 'prisvekst-midtbyen-2026' },
      bydel: { _type: 'reference', _ref: 'bydel-midtbyen' },
      excerpt: 'Midtbyen fortsetter å trekke oppover. Vi ser på tallene bak veksten og hva som driver markedet i sentrum.',
      isNewsletter: true,
      publishedAt: '2026-03-10T10:00:00Z',
      content: [
        { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Boligprisene i Midtbyen har steget med 8,2% det siste kvartalet, viser ferske tall fra Eiendom Norge. Dette er den sterkeste veksten i Trondheim.' }] },
        { _type: 'block', _key: 'b2', style: 'h2', children: [{ _type: 'span', _key: 's2', text: 'Hva driver veksten?' }] },
        { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'Lav tilbudsside kombinert med høy etterspørsel etter sentrale leiligheter er hovedårsaken. Mange unge kjøpere ser mot Midtbyen for sin første bolig.' }] },
        { _type: 'block', _key: 'b4', style: 'h2', children: [{ _type: 'span', _key: 's4', text: 'Fremtidsutsikter' }] },
        { _type: 'block', _key: 'b5', style: 'normal', children: [{ _type: 'span', _key: 's5', text: 'Analytikere forventer at veksten vil avta noe i neste kvartal, men at prisene vil holde seg stabile gjennom året.' }] },
      ],
    },
    {
      _type: 'post',
      _id: 'post-nybygg-lade',
      title: 'Nytt boligfelt på Lade — 120 nye boliger',
      slug: { _type: 'slug', current: 'nybygg-lade-2026' },
      bydel: { _type: 'reference', _ref: 'bydel-lade' },
      excerpt: 'Et nytt boligprosjekt på Lade vil gi 120 nye boliger. Prosjektet er ventet ferdigstilt i 2027.',
      isNewsletter: true,
      publishedAt: '2026-03-08T10:00:00Z',
      content: [
        { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Utvikleren OBOS har annonsert et nytt boligfelt på Lade med 120 boliger, fra 2-roms til 5-roms leiligheter.' }] },
        { _type: 'block', _key: 'b2', style: 'h2', children: [{ _type: 'span', _key: 's2', text: 'Om prosjektet' }] },
        { _type: 'block', _key: 'b3', style: 'normal', children: [{ _type: 'span', _key: 's3', text: 'Boligene bygges i trekonstruksjon med fokus på bærekraft. Alle boliger får balkong eller terrasse, og det planlegges felles grøntområder.' }] },
      ],
    },
    {
      _type: 'post',
      _id: 'post-byasen-stabile',
      title: 'Byåsen holder stabile priser tross usikkerhet',
      slug: { _type: 'slug', current: 'byasen-stabile-priser-2026' },
      bydel: { _type: 'reference', _ref: 'bydel-byasen' },
      excerpt: 'Mens andre bydeler svinger, viser Byåsen seg som et stabilt marked for boligkjøpere.',
      isNewsletter: true,
      publishedAt: '2026-03-05T10:00:00Z',
      content: [
        { _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Byåsen har lenge vært kjent som en stabil bydel i Trondheims boligmarked. Også i 2026 holder prisene seg jevne.' }] },
        { _type: 'block', _key: 'b2', style: 'normal', children: [{ _type: 'span', _key: 's2', text: 'Gjennomsnittlig kvadratmeterpris ligger på 52.000 kr, en økning på 1,5% fra forrige kvartal. Familieboligene er mest etterspurt.' }] },
      ],
    },
  ]

  for (const p of posts) {
    await client.createOrReplace(p)
    console.log(`  ✓ ${p.title}`)
  }

  console.log('\n✅ Seeding ferdig!')
}

seed().catch(console.error)
