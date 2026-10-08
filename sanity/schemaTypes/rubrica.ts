import {defineField, defineType} from 'sanity'

export const rubrica = defineType({
  name: 'rubrica', title: 'Rubrica', type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titolo', type: 'string', validation: rule => rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: rule => rule.required()}),
    defineField({name: 'description', title: 'Descrizione breve', type: 'text', rows: 3, validation: rule => rule.max(300)}),
  ],
})
