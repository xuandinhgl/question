export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Câu hỏi',
      type: 'string',
    },
    {
      name: 'categories',
      title: 'Danh mục',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    },
    {
      name: 'answer',
      title: 'Trả lời',
      type: 'string',
    },
  ],

  preview: {
    select: {
      title: 'question',
    },
    prepare(selection) {
      const {author} = selection
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`,
      })
    },
  },
}
