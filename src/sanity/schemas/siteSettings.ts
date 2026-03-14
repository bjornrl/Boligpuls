import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Nettstedinnstillinger',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero-overskrift',
      type: 'string',
      description: 'Hovedoverskrift på forsiden',
      initialValue: 'Boligmarkedet i Trondheim',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero-undertekst',
      type: 'text',
      rows: 2,
      description: 'Undertekst på forsiden',
      initialValue: 'Hold deg oppdatert på boligmarkedet i din bydel. Få ukentlige eller månedlige oppdateringer rett i innboksen.',
    }),
    defineField({
      name: 'aboutText',
      title: 'Om oss-tekst',
      type: 'text',
      rows: 4,
      description: 'Tekst i footer om Boligpuls',
    }),
    defineField({
      name: 'seoTitle',
      title: 'Standard SEO-tittel',
      type: 'string',
      initialValue: 'Boligpuls Trondheim — Nyhetsbrev om boligmarkedet',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Standard SEO-beskrivelse',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Nettstedinnstillinger' }
    },
  },
})
