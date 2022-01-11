export const getAllQuestions = `
 *[_type == "post" ] | order(_updatedAt desc) {
    _id,
    question,
    answer,
  }
`