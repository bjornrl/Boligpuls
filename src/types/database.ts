export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bydeler: {
        Row: {
          id: string
          slug: string
          name: string
          color: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          color: string
          emoji?: string
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          color?: string
          emoji?: string
          created_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          bydel_id: string
          is_newsletter: boolean
          is_published: boolean
          published_at: string | null
          author_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          bydel_id: string
          is_newsletter?: boolean
          is_published?: boolean
          published_at?: string | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          bydel_id?: string
          is_newsletter?: boolean
          is_published?: boolean
          published_at?: string | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'posts_bydel_id_fkey'
            columns: ['bydel_id']
            isOneToOne: false
            referencedRelation: 'bydeler'
            referencedColumns: ['id']
          }
        ]
      }
      subscribers: {
        Row: {
          id: string
          email: string
          name: string
          frequency: string
          is_active: boolean
          confirmed: boolean
          confirm_token: string
          unsubscribe_token: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string
          frequency?: string
          is_active?: boolean
          confirmed?: boolean
          confirm_token?: string
          unsubscribe_token?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          frequency?: string
          is_active?: boolean
          confirmed?: boolean
          confirm_token?: string
          unsubscribe_token?: string
          created_at?: string
        }
        Relationships: []
      }
      subscriber_bydeler: {
        Row: {
          subscriber_id: string
          bydel_id: string
        }
        Insert: {
          subscriber_id: string
          bydel_id: string
        }
        Update: {
          subscriber_id?: string
          bydel_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscriber_bydeler_subscriber_id_fkey'
            columns: ['subscriber_id']
            isOneToOne: false
            referencedRelation: 'subscribers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'subscriber_bydeler_bydel_id_fkey'
            columns: ['bydel_id']
            isOneToOne: false
            referencedRelation: 'bydeler'
            referencedColumns: ['id']
          }
        ]
      }
      newsletter_sends: {
        Row: {
          id: string
          post_id: string
          subscriber_id: string
          sent_at: string
          status: string
        }
        Insert: {
          id?: string
          post_id: string
          subscriber_id: string
          sent_at?: string
          status?: string
        }
        Update: {
          id?: string
          post_id?: string
          subscriber_id?: string
          sent_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'newsletter_sends_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'newsletter_sends_subscriber_id_fkey'
            columns: ['subscriber_id']
            isOneToOne: false
            referencedRelation: 'subscribers'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Bydel = Database['public']['Tables']['bydeler']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Subscriber = Database['public']['Tables']['subscribers']['Row']
export type NewsletterSend = Database['public']['Tables']['newsletter_sends']['Row']

export type PostWithBydel = Post & {
  bydeler: Bydel
}
