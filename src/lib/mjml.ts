export async function compileMjml(mjmlContent: string): Promise<string> {
  const mjml2html = (await import('mjml')).default
  const result = mjml2html(mjmlContent)
  if (result.errors?.length) {
    console.warn('[mjml] Compilation warnings:', result.errors)
  }
  return result.html
}
