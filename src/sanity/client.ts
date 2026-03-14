import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: 'p7x7ccrx',
  dataset: 'production',
  apiVersion: '2026-03-14',
  useCdn: true,
})

// Client for server-side fetching with token (for drafts/preview if needed)
export const sanityWriteClient = createClient({
  projectId: 'p7x7ccrx',
  dataset: 'production',
  apiVersion: '2026-03-14',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})
