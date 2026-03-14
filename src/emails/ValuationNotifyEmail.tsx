import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Preview,
  Link,
} from '@react-email/components'

interface ValuationNotifyEmailProps {
  name: string
  email: string
  phone: string | null
  address: string
  bydel: string | null
  requestType: 'verdivurdering' | 'salgstilbud'
  message: string | null
}

export default function ValuationNotifyEmail({
  name,
  email,
  phone,
  address,
  bydel,
  requestType,
  message,
}: ValuationNotifyEmailProps) {
  const typeText = requestType === 'verdivurdering' ? 'Verdivurdering' : 'Salgstilbud'
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/foresporser`

  return (
    <Html>
      <Head />
      <Preview>Ny forespørsel om {typeText.toLowerCase()} fra {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Boligpuls Admin</Text>
          </Section>
          <Section style={content}>
            <Text style={heading}>Ny forespørsel om {typeText.toLowerCase()}</Text>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>Navn</td>
                  <td style={valueCell}>{name}</td>
                </tr>
                <tr>
                  <td style={labelCell}>E-post</td>
                  <td style={valueCell}>{email}</td>
                </tr>
                {phone && (
                  <tr>
                    <td style={labelCell}>Telefon</td>
                    <td style={valueCell}>{phone}</td>
                  </tr>
                )}
                <tr>
                  <td style={labelCell}>Adresse</td>
                  <td style={valueCell}>{address}</td>
                </tr>
                {bydel && (
                  <tr>
                    <td style={labelCell}>Bydel</td>
                    <td style={valueCell}>{bydel}</td>
                  </tr>
                )}
                <tr>
                  <td style={labelCell}>Type</td>
                  <td style={valueCell}>{typeText}</td>
                </tr>
                {message && (
                  <tr>
                    <td style={labelCell}>Melding</td>
                    <td style={valueCell}>{message}</td>
                  </tr>
                )}
              </tbody>
            </table>
            <Section style={{ marginTop: '24px' }}>
              <Link href={adminUrl} style={link}>
                Se alle forespørsler i admin-panelet →
              </Link>
            </Section>
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

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
}

const labelCell = {
  padding: '8px 12px 8px 0',
  fontSize: '14px',
  color: '#78716C',
  verticalAlign: 'top' as const,
  whiteSpace: 'nowrap' as const,
}

const valueCell = {
  padding: '8px 0',
  fontSize: '14px',
  color: '#1C1917',
  verticalAlign: 'top' as const,
}

const link = {
  color: '#D4593A',
  fontSize: '14px',
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
