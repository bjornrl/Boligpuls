import { defineType, defineField } from 'sanity'

export const bydel = defineType({
  name: 'bydel',
  title: 'Bydel',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Navn',
      type: 'string',
      validation: (rule) => rule.required().error('Bydelen må ha et navn'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required().error('Slug er påkrevd'),
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      description: 'Emoji-ikon for bydelen (f.eks. 🏛)',
    }),
    defineField({
      name: 'color',
      title: 'Farge',
      type: 'string',
      description: 'Hex-fargekode (f.eks. #D7B180)',
      validation: (rule) => rule.required().error('Farge er påkrevd'),
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 3,
      description: 'Kort beskrivelse av bydelen',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'emoji' },
    prepare({ title, subtitle }) {
      return { title: `${subtitle || ''} ${title}` }
    },
  },
})
