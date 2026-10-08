import {defineArrayMember, defineField, defineType} from 'sanity'
import {sections} from '../../app/lib/sections'

export const article = defineType({
  name: 'article',
  title: 'Articolo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Estratto',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'coverImage',
      title: 'Immagine di copertina',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Testo alternativo',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({name: 'caption', title: 'Didascalia', type: 'string'}),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'articleType',
      title: 'Tipologia',
      type: 'string',
      options: {
        list: sections.map(({value, label}) => ({value, title: label})),
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'rubrica', title: 'Rubrica', type: 'reference', to: [{type: 'rubrica'}]}),
    defineField({
      name: 'author',
      title: 'Autore',
      type: 'reference',
      to: [{type: 'author'}],
      description: 'Autore principale; resta compatibile con gli articoli esistenti.',
      validation: (rule) => rule.custom((value, context) => value || (context.document?.authors as unknown[] | undefined)?.length ? true : 'Seleziona almeno un autore.'),
    }),
    defineField({
      name: 'authors', title: 'Coautori', type: 'array',
      description: 'Aggiungi altri autori. L’autore principale viene mostrato per primo, senza duplicati.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'author'}]})],
      validation: rule => rule.unique(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data di pubblicazione',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'readingTime',
      title: 'Tempo di lettura (minuti)',
      type: 'number',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'featured',
      title: 'In evidenza',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Corpo',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Testo alternativo',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'caption', title: 'Didascalia', type: 'string'}),
            defineField({name: 'credit', title: 'Credito fotografico', type: 'string', description: 'Inserisci il nome: sul sito apparirà “Foto: …”.'}),
            defineField({name: 'fullWidth', title: 'Larghezza estesa', type: 'boolean', initialValue: false}),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tag',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'articleType', media: 'coverImage'},
  },
})
