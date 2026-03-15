import { defineType, defineField } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Innlegg',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (rule) => rule.required().error('Tittel er påkrevd'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required().error('Slug er påkrevd'),
    }),
    defineField({
      name: 'reportType',
      title: 'Rapporttype',
      type: 'string',
      options: {
        list: [
          { title: 'Ukentlig oppdatering', value: 'ukentlig' },
          { title: 'Månedlig rapport', value: 'manedlig' },
          { title: 'Kvartalsrapport', value: 'kvartal' },
          { title: 'Årsrapport', value: 'arsrapport' },
        ],
      },
      validation: (rule) => rule.required().error('Velg en rapporttype'),
    }),
    defineField({
      name: 'reportPeriod',
      title: 'Periode',
      type: 'string',
      description: 'F.eks. "Uke 11, 2026", "Mars 2026", "Q1 2026", "2025"',
    }),
    defineField({
      name: 'excerpt',
      title: 'Sammendrag',
      type: 'text',
      rows: 3,
      description: 'Kort oppsummering som vises i kortvisning',
      validation: (rule) => rule.required().error('Sammendrag er påkrevd'),
    }),
    defineField({
      name: 'content',
      title: 'Innhold',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Sitat', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Fet', value: 'strong' },
              { title: 'Kursiv', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Lenke',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'object',
          name: 'bydelSection',
          title: 'Bydel-seksjon',
          fields: [
            {
              name: 'bydel',
              title: 'Bydel',
              type: 'reference',
              to: [{ type: 'bydel' }],
            },
            {
              name: 'content',
              title: 'Innhold for denne bydelen',
              type: 'array',
              of: [
                { type: 'block' },
                { type: 'image', options: { hotspot: true } },
              ],
            },
          ],
          preview: {
            select: { title: 'bydel.name', emoji: 'bydel.emoji' },
            prepare({ title, emoji }: { title?: string; emoji?: string }) {
              return { title: `${emoji || ''} ${title || 'Velg bydel'}` }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'bydeler',
      title: 'Bydeler omtalt i rapporten',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'bydel' }] }],
      description: 'Hvilke bydeler er omtalt? Brukes for innholdsfortegnelse.',
    }),
    defineField({
      name: 'isNewsletter',
      title: 'Send som nyhetsbrev',
      type: 'boolean',
      initialValue: true,
      description: 'Marker om dette innlegget skal sendes som nyhetsbrev',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publiseringsdato',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'bydel',
      title: 'Bydel (utgått)',
      type: 'reference',
      to: [{ type: 'bydel' }],
      hidden: true,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO-tittel',
      type: 'string',
      description: 'Valgfri tittel for søkemotorer',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO-beskrivelse',
      type: 'text',
      rows: 2,
      description: 'Valgfri beskrivelse for søkemotorer',
      group: 'seo',
    }),
  ],
  groups: [
    { name: 'seo', title: 'SEO' },
  ],
  orderings: [
    {
      title: 'Publiseringsdato (nyeste først)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      reportType: 'reportType',
      period: 'reportPeriod',
      date: 'publishedAt',
    },
    prepare({ title, reportType, period, date }: { title?: string; reportType?: string; period?: string; date?: string }) {
      const typeLabels: Record<string, string> = {
        ukentlig: '📊 Ukentlig',
        manedlig: '📈 Månedlig',
        kvartal: '📋 Kvartal',
        arsrapport: '📑 Årsrapport',
      }
      return {
        title,
        subtitle: `${typeLabels[reportType || ''] || ''} ${period || ''} — ${date ? new Date(date).toLocaleDateString('nb-NO') : 'Ikke publisert'}`,
      }
    },
  },
})
