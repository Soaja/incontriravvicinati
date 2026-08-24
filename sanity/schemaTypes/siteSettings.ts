import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Impostazioni del sito',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Titolo del sito',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', title: 'Descrizione', type: 'text', rows: 4}),
    defineField({
      name: 'contactEmail',
      title: 'Email di contatto',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'URL Instagram',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({name: 'footerText', title: 'Testo del footer', type: 'text', rows: 3}),
  ],
  preview: {
    prepare() {
      return {title: 'Impostazioni del sito'}
    },
  },
})
