import { defineType, defineField } from 'sanity'
import { HtmlUploader } from '../components/HtmlUploader'
import { AddressGeocoder } from '../components/AddressGeocoder'

export const localReport = defineType({
  name: 'localReport',
  title: 'Lokalrapport',
  type: 'document',
  icon: () => '📍',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'F.eks. "Ilavegen 21-35" eller "Solsiden 4-8"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'string',
      description: 'Full adresse for geocoding, f.eks. "Ilavegen 21, 7018 Trondheim"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Koordinater',
      type: 'object',
      description: 'Bruk "Søk opp adresse"-knappen for å finne koordinater automatisk.',
      components: {
        input: AddressGeocoder,
      },
      fields: [
        { name: 'lat', type: 'number', title: 'Breddegrad (lat)' },
        { name: 'lng', type: 'number', title: 'Lengdegrad (lng)' },
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Sammendrag',
      type: 'text',
      rows: 3,
      description: 'Kort oppsummering som vises i kortvisning og søkeresultater.',
    }),
    defineField({
      name: 'contentMode',
      title: 'Innholdstype',
      type: 'string',
      options: {
        list: [
          { title: 'HTML / MJML', value: 'html' },
          { title: 'Rik tekst', value: 'portable-text' },
        ],
        layout: 'radio',
      },
      initialValue: 'html',
    }),
    defineField({
      name: 'htmlContent',
      title: 'HTML-innhold',
      type: 'text',
      components: {
        input: HtmlUploader,
      },
      hidden: ({ parent }) => parent?.contentMode !== 'html',
    }),
    defineField({
      name: 'content',
      title: 'Innhold (rik tekst)',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
      hidden: ({ parent }) => parent?.contentMode === 'html',
    }),
    defineField({
      name: 'searchTerms',
      title: 'Søkeord',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Ekstra søkeord for å hjelpe folk finne rapporten. F.eks. "Ila", "blokkleiligheter", "3-roms"',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publiseringsdato',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required().error('Publiseringsdato er påkrevd for at rapporten skal vises'),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', type: 'string', title: 'Meta-tittel' },
        { name: 'metaDescription', type: 'text', title: 'Meta-beskrivelse', rows: 2 },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', address: 'address', date: 'publishedAt' },
    prepare({ title, address, date }: { title?: string; address?: string; date?: string }) {
      return {
        title: `📍 ${title}`,
        subtitle: `${address || ''} — ${date ? new Date(date).toLocaleDateString('nb-NO') : 'Ikke publisert'}`,
      }
    },
  },
})
