import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Preview,
} from '@react-email/components'

interface ValuationConfirmEmailProps {
  name: string
  requestType: 'verdivurdering' | 'salgstilbud'
}

export default function ValuationConfirmEmail({ name, requestType }: ValuationConfirmEmailProps) {
  const typeText = requestType === 'verdivurdering' ? 'verdivurdering' : 'tilbud på salg'

  return (
    <Html>
      <Head />
      <Preview>Vi har mottatt din forespørsel — Boligpuls Trondheim</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Boligpuls Trondheim</Text>
          </Section>
          <Section style={content}>
            <Text style={heading}>Hei {name},</Text>
            <Text style={paragraph}>
              Takk for din henvendelse. Vi har mottatt din forespørsel om {typeText} og tar kontakt innen 1–2 virkedager.
            </Text>
            <Text style={paragraph}>
              Med vennlig hilsen,
              <br />
              Boligpuls Trondheim
            </Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>&copy; 2026 Boligpuls Trondheim</Text>
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
  maxWidth: '560px',
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

const heading = {
  fontSize: '20px',
  fontWeight: '600' as const,
  color: '#002D32',
  marginBottom: '16px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#155356',
  marginBottom: '16px',
}

const hr = {
  borderColor: '#E8ECEE',
  marginTop: '32px',
  marginBottom: '16px',
}

const footer = {
  fontSize: '12px',
  color: '#9BAFB2',
  textAlign: 'center' as const,
}
