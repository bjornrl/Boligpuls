'use client'

import { useCallback, useState } from 'react'
import { set, unset } from 'sanity'
import { Stack, Card, Button, Text, TextArea, Flex } from '@sanity/ui'

export function HtmlUploader(props: any) {
  const { onChange, value = '' } = props
  const [preview, setPreview] = useState(false)

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const html = e.target?.result as string
        onChange(set(html))
      }
      reader.readAsText(file)
    },
    [onChange]
  )

  const handlePaste = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const html = event.target.value
      if (html) {
        onChange(set(html))
      } else {
        onChange(unset())
      }
    },
    [onChange]
  )

  return (
    <Stack space={3}>
      <Flex gap={2}>
        <Card padding={3} radius={2} shadow={1} style={{ flex: 1 }}>
          <Stack space={3}>
            <Text size={1} weight="semibold">Last opp HTML-fil</Text>
            <input
              type="file"
              accept=".html,.htm"
              onChange={handleFileUpload}
              style={{ fontSize: 14 }}
            />
          </Stack>
        </Card>
      </Flex>

      <TextArea
        value={value}
        onChange={handlePaste}
        rows={15}
        placeholder="Eller lim inn HTML her..."
        style={{ fontFamily: 'monospace', fontSize: 13 }}
      />

      {value && (
        <Stack space={2}>
          <Flex gap={2} align="center">
            <Button
              text={preview ? 'Skjul forhåndsvisning' : 'Vis forhåndsvisning'}
              mode="ghost"
              onClick={() => setPreview(!preview)}
            />
            <Text size={1} muted>
              {value.length} tegn
            </Text>
          </Flex>

          {preview && (
            <Card padding={4} radius={2} shadow={1} style={{ background: '#fff' }}>
              <iframe
                srcDoc={value}
                style={{
                  width: '100%',
                  minHeight: 600,
                  border: 'none',
                  borderRadius: 4,
                }}
                title="HTML forhåndsvisning"
                sandbox="allow-same-origin"
              />
            </Card>
          )}
        </Stack>
      )}
    </Stack>
  )
}
