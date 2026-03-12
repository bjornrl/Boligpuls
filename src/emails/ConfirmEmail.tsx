import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
  Link,
} from '@react-email/components'

interface ConfirmEmailProps {
  name: string
  confirmUrl: string
}

export default function ConfirmEmail({ name, confirmUrl }: ConfirmEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bekreft e-postadressen din for Boligpuls Trondheim</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Boligpuls Trondheim</Text>
          </Section>
          <Section style={content}>
            <Text style={heading}>Hei {name}!</Text>
            <Text style={paragraph}>
              Takk for at du meldte deg på Boligpuls Trondheim.
            </Text>
            <Text style={paragraph}>
              Klikk knappen under for å bekrefte e-postadressen din:
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={confirmUrl}>
                Bekreft e-postadressen min
              </Button>
            </Section>
            <Text style={smallText}>
              Eller kopier denne lenken:{' '}
              <Link href={confirmUrl} style={link}>
                {confirmUrl}
              </Link>
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
  backgroundColor: '#FAF9F6',
  fontFamily: "'Outfit', system-ui, sans-serif",
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
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

const heading = {
  fontSize: '20px',
  fontWeight: '600' as const,
  color: '#1C1917',
  marginBottom: '16px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#1C1917',
  marginBottom: '16px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '24px',
  marginBottom: '24px',
}

const button = {
  backgroundColor: '#D4593A',
  borderRadius: '12px',
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  padding: '14px 32px',
  display: 'inline-block',
}

const smallText = {
  fontSize: '13px',
  color: '#78716C',
  lineHeight: '1.5',
  wordBreak: 'break-all' as const,
}

const link = {
  color: '#D4593A',
}

const hr = {
  borderColor: '#EDEBE8',
  marginTop: '32px',
  marginBottom: '16px',
}

const footer = {
  fontSize: '12px',
  color: '#A8A29E',
  textAlign: 'center' as const,
}
