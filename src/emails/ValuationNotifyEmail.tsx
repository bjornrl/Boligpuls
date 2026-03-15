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
            <Text style={logo}>Eiendom Trondheim Admin</Text>
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
          <Text style={footer}>&copy; 2026 Eiendom Trondheim</Text>
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

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
}

const labelCell = {
  padding: '8px 12px 8px 0',
  fontSize: '14px',
  color: '#5F7A7D',
  verticalAlign: 'top' as const,
  whiteSpace: 'nowrap' as const,
}

const valueCell = {
  padding: '8px 0',
  fontSize: '14px',
  color: '#002D32',
  verticalAlign: 'top' as const,
}

const link = {
  color: '#155356',
  fontSize: '14px',
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

const siteLink = {
  fontSize: '13px',
  color: '#9BAFB2',
  textAlign: 'center' as const,
  marginTop: '8px',
}
