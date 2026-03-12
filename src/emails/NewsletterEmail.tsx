import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Preview,
} from '@react-email/components'

interface NewsletterEmailProps {
  postTitle: string
  bydelName: string
  bydelEmoji: string
  bydelColor: string
  contentHtml: string
  publishedDate: string
  unsubscribeUrl: string
}

export default function NewsletterEmail({
  postTitle,
  bydelName,
  bydelEmoji,
  bydelColor,
  contentHtml,
  publishedDate,
  unsubscribeUrl,
}: NewsletterEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{postTitle} — Boligpuls Trondheim</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Boligpuls Trondheim</Text>
          </Section>
          <Section style={content}>
            <Section style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
              <Text
                style={{
                  display: 'inline-block',
                  backgroundColor: `${bydelColor}20`,
                  color: bydelColor,
                  borderRadius: '100px',
                  padding: '6px 16px',
                  fontSize: '14px',
                  fontWeight: '600' as const,
                  border: `1px solid ${bydelColor}30`,
                  margin: '0',
                }}
              >
                {bydelEmoji} {bydelName}
              </Text>
            </Section>
            <Text style={date}>{publishedDate}</Text>
            <Text style={title}>{postTitle}</Text>
            <Section
              dangerouslySetInnerHTML={{ __html: contentHtml }}
              style={articleContent}
            />
          </Section>
          <Hr style={hr} />
          <Text style={footerText}>
            Du mottar dette fordi du abonnerer på Boligpuls Trondheim.
          </Text>
          <Section style={{ textAlign: 'center' as const }}>
            <Link href={unsubscribeUrl} style={unsubLink}>
              Avmeld nyhetsbrev
            </Link>
          </Section>
          <Text style={copyright}>&copy; 2026 Boligpuls Trondheim</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#FAF9F6',
  fontFamily: "'Outfit', system-ui, sans-serif",
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
}

const header = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const logo = {
  fontSize: '24px',
  fontWeight: '700' as const,
  color: '#1C1917',
  margin: '0',
}

const content = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  padding: '40px 32px',
  border: '1px solid #EDEBE8',
}

const date = {
  fontSize: '14px',
  color: '#78716C',
  textAlign: 'center' as const,
  margin: '0 0 8px',
}

const title = {
  fontSize: '28px',
  fontWeight: '700' as const,
  color: '#1C1917',
  textAlign: 'center' as const,
  lineHeight: '1.3',
  marginBottom: '32px',
  fontFamily: "'Georgia', serif",
}

const articleContent = {
  fontSize: '16px',
  lineHeight: '1.85',
  color: '#1C1917',
}

const hr = {
  borderColor: '#EDEBE8',
  marginTop: '32px',
  marginBottom: '16px',
}

const footerText = {
  fontSize: '13px',
  color: '#A8A29E',
  textAlign: 'center' as const,
  marginBottom: '8px',
}

const unsubLink = {
  fontSize: '13px',
  color: '#78716C',
  textDecoration: 'underline',
}

const copyright = {
  fontSize: '12px',
  color: '#A8A29E',
  textAlign: 'center' as const,
  marginTop: '16px',
}
