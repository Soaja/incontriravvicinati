import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Autore',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'role', title: 'Ruolo', type: 'string'}),
    defineField({name: 'bio', title: 'Biografia', type: 'text', rows: 5}),
    defineField({
      name: 'showInEditorialTeam',
      title: 'Mostra nella redazione',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Ordine nella redazione',
      type: 'number',
      description: 'Numero più basso = posizione più alta nella pagina.',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Testo alternativo', type: 'string'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
})
