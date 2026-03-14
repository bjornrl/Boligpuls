export type Bydel = {
  id: string
  slug: string
  name: string
  color: string
  emoji: string
  created_at: string
}

export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  bydel_id: string
  is_newsletter: boolean
  is_published: boolean
  published_at: string | null
  author_id: string | null
  created_at: string
  updated_at: string
}

export type PostWithBydel = Post & {
  bydeler: Bydel
}

export type Subscriber = {
  id: string
  email: string
  name: string
  frequency: 'weekly' | 'monthly'
  is_active: boolean
  confirmed: boolean
  confirm_token: string
  unsubscribe_token: string
  created_at: string
}

export type SubscriberWithBydeler = Subscriber & {
  subscriber_bydeler: {
    bydel_id: string
    bydeler: Bydel
  }[]
}

export type NewsletterSend = {
  id: string
  post_id: string
  subscriber_id: string
  sent_at: string
  status: 'sent' | 'failed' | 'bounced'
}

export type ValuationRequest = {
  id: string
  name: string
  email: string
  phone: string | null
  address: string
  bydel_id: string | null
  request_type: 'verdivurdering' | 'salgstilbud'
  message: string | null
  status: 'ny' | 'kontaktet' | 'fullfort'
  created_at: string
}

export type ValuationRequestWithBydel = ValuationRequest & {
  bydeler: Bydel | null
}
