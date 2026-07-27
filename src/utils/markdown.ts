/**
 * Minimal, XSS-safe markdown → HTML renderer for blog post bodies. The source
 * is HTML-escaped first, then a small subset of markdown is applied on top, so
 * no raw HTML from the payload can ever reach the DOM.
 *
 * Supported: headings (# … ####), unordered lists (- / *), blockquotes (>),
 * paragraphs, and inline **bold**, *italic* / _italic_, `code`, and
 * [links](https://…).
 */

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inline(text: string): string {
  return text
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (_m, label, href) =>
        `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`,
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/_([^_\n]+)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

export function renderMarkdown(markdown: string): string {
  const lines = escapeHtml(markdown.replace(/\r\n/g, '\n')).split('\n')
  const out: string[] = []
  let listOpen = false
  let i = 0

  const closeList = () => {
    if (listOpen) {
      out.push('</ul>')
      listOpen = false
    }
  }

  const isBlockStart = (line: string) =>
    /^#{1,4}\s+/.test(line) || /^[-*]\s+/.test(line) || /^&gt;\s?/.test(line)

  while (i < lines.length) {
    const trimmed = lines[i].trim()

    if (trimmed === '') {
      closeList()
      i++
      continue
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(trimmed)
    if (heading) {
      closeList()
      const level = heading[1].length
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      i++
      continue
    }

    const listItem = /^[-*]\s+(.*)$/.exec(trimmed)
    if (listItem) {
      if (!listOpen) {
        out.push('<ul>')
        listOpen = true
      }
      out.push(`<li>${inline(listItem[1])}</li>`)
      i++
      continue
    }

    const quote = /^&gt;\s?(.*)$/.exec(trimmed)
    if (quote) {
      closeList()
      out.push(`<blockquote>${inline(quote[1])}</blockquote>`)
      i++
      continue
    }

    // Paragraph: consume consecutive non-blank, non-block lines.
    closeList()
    const paragraph: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i].trim())) {
      paragraph.push(lines[i].trim())
      i++
    }
    out.push(`<p>${inline(paragraph.join(' '))}</p>`)
  }

  closeList()
  return out.join('\n')
}
