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

interface WelcomeEmailProps {
  name: string
  bydeler: { name: string; emoji: string }[]
  frequency: string
}

export default function WelcomeEmail({ name, bydeler, frequency }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Velkommen til Boligpuls Trondheim</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Boligpuls Trondheim</Text>
          </Section>
          <Section style={content}>
            <Text style={heading}>Velkommen, {name}!</Text>
            <Text style={paragraph}>
              Du er nå påmeldt nyhetsbrev for disse bydelene:
            </Text>
            <Section style={bydelList}>
              {bydeler.map((bydel, i) => (
                <Text key={i} style={bydelItem}>
                  {bydel.emoji} {bydel.name}
                </Text>
              ))}
            </Section>
            <Text style={paragraph}>
              Du vil motta {frequency === 'weekly' ? 'ukentlige' : 'månedlige'} oppdateringer
              om boligmarkedet i dine valgte bydeler.
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

const bydelList = {
  backgroundColor: '#FAF9F6',
  borderRadius: '10px',
  padding: '16px 20px',
  marginBottom: '16px',
}

const bydelItem = {
  fontSize: '15px',
  color: '#1C1917',
  margin: '4px 0',
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
