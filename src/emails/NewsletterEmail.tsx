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

interface BydelRef {
  name: string
  slug: string
  emoji: string
}

interface NewsletterEmailProps {
  postTitle: string
  reportLabel: string
  reportPeriod: string
  contentHtml: string
  publishedDate: string
  unsubscribeUrl: string
  bydeler: BydelRef[]
}

export default function NewsletterEmail({
  postTitle,
  reportLabel,
  reportPeriod,
  contentHtml,
  publishedDate,
  unsubscribeUrl,
  bydeler,
}: NewsletterEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{postTitle} — Eiendom Trondheim</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Eiendom Trondheim</Text>
          </Section>
          <Section style={content}>
            {reportLabel && (
              <Section style={{ textAlign: 'center' as const, marginBottom: '16px' }}>
                <Text
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#DEE5E7',
                    color: '#155356',
                    borderRadius: '100px',
                    padding: '6px 16px',
                    fontSize: '13px',
                    fontWeight: '600' as const,
                    margin: '0',
                  }}
                >
                  {reportLabel}{reportPeriod ? ` — ${reportPeriod}` : ''}
                </Text>
              </Section>
            )}
            <Text style={date}>{publishedDate}</Text>
            <Text style={title}>{postTitle}</Text>
            {bydeler && bydeler.length > 0 && (
              <Section style={{ marginBottom: '24px', textAlign: 'center' as const }}>
                <Text style={{ fontSize: '13px', color: '#5F7A7D', margin: '0 0 8px' }}>
                  <strong>I denne rapporten:</strong>
                </Text>
                <Text style={{ fontSize: '13px', color: '#155356', margin: '0' }}>
                  {bydeler.map((b) => `${b.emoji} ${b.name}`).join(' · ')}
                </Text>
              </Section>
            )}
            <div
              dangerouslySetInnerHTML={{ __html: contentHtml }}
              style={articleContent}
            />
          </Section>
          <Hr style={hr} />
          <Text style={footerText}>
            Du mottar dette fordi du abonnerer på Eiendom Trondheim.
          </Text>
          <Section style={{ textAlign: 'center' as const }}>
            <Link href={unsubscribeUrl} style={unsubLink}>
              Avmeld nyhetsbrev
            </Link>
          </Section>
          <Text style={copyright}>&copy; 2026 Eiendom Trondheim</Text>
          <Text style={siteLink}>
            <a href="https://eiendomtrondheim.no" style={{ color: '#155356', textDecoration: 'underline' }}>
              eiendomtrondheim.no
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#F8F7F5',
  fontFamily: "'Basel Grotesk', 'Helvetica', system-ui, sans-serif",
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#002D32',
  borderRadius: '16px 16px 0 0',
  padding: '24px 32px',
  textAlign: 'center' as const,
}

const logo = {
  fontSize: '24px',
  fontWeight: '700' as const,
  color: '#FFFFFF',
  margin: '0',
}

const content = {
  backgroundColor: '#FFFFFF',
  borderRadius: '0 0 16px 16px',
  padding: '40px 32px',
  border: '1px solid #E8ECEE',
  borderTop: 'none',
}

const date = {
  fontSize: '14px',
  color: '#5F7A7D',
  textAlign: 'center' as const,
  margin: '0 0 8px',
}

const title = {
  fontSize: '28px',
  fontWeight: '400' as const,
  color: '#002D32',
  textAlign: 'center' as const,
  lineHeight: '1.3',
  marginBottom: '32px',
  fontFamily: "'Basel Classic', Georgia, serif",
}

const articleContent = {
  fontSize: '16px',
  lineHeight: '1.85',
  color: '#155356',
}

const hr = {
  borderColor: '#E8ECEE',
  marginTop: '32px',
  marginBottom: '16px',
}

const footerText = {
  fontSize: '13px',
  color: '#9BAFB2',
  textAlign: 'center' as const,
  marginBottom: '8px',
}

const unsubLink = {
  fontSize: '13px',
  color: '#5F7A7D',
  textDecoration: 'underline',
}

const copyright = {
  fontSize: '12px',
  color: '#9BAFB2',
  textAlign: 'center' as const,
  marginTop: '16px',
}

const siteLink = {
  fontSize: '13px',
  color: '#9BAFB2',
  textAlign: 'center' as const,
  marginTop: '8px',
}
