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
      name: 'bydel',
      title: 'Bydel',
      type: 'reference',
      to: [{ type: 'bydel' }],
      validation: (rule) => rule.required().error('Velg en bydel'),
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
      ],
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
      name: 'seoTitle',
      title: 'SEO-tittel',
      type: 'string',
      description: 'Valgfri tittel for søkemotorer (bruker vanlig tittel hvis tom)',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO-beskrivelse',
      type: 'text',
      rows: 2,
      description: 'Valgfri beskrivelse for søkemotorer (bruker sammendrag hvis tom)',
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
      bydel: 'bydel.name',
      emoji: 'bydel.emoji',
      date: 'publishedAt',
    },
    prepare({ title, bydel, emoji, date }) {
      return {
        title,
        subtitle: `${emoji || ''} ${bydel || 'Ingen bydel'} — ${date ? new Date(date).toLocaleDateString('nb-NO') : 'Ikke publisert'}`,
      }
    },
  },
})
