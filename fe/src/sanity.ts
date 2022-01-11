import sanityClient from '@sanity/client'

export const client = sanityClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID as string,
    dataset: 'production',
    apiVersion: '2021-03-25',
    useCdn: true,
})