import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'

export default defineConfig({
  name: 'boligpuls',
  title: 'Eiendom Trondheim',

  projectId: 'p7x7ccrx',
  dataset: 'production',
  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Innhold')
          .items([
            S.documentTypeListItem('post').title('Rapporter'),
            S.documentTypeListItem('localReport').title('Lokalrapporter'),
            S.divider(),
            S.documentTypeListItem('bydel').title('Bydeler'),
            S.documentTypeListItem('siteSettings').title('Innstillinger'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
