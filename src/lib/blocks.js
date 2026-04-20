// Case study block schema — the shape of every piece of content that flows
// between the hero image and the "next project" card on a case study page.
//
// Each block is `{ id, type, ...props }`. Admin edits each block through a
// type-specific editor. The site walks the array in order and renders each
// one with a matching React component.

export const BLOCK_LABELS = {
  heading: 'Heading',
  paragraph: 'Paragraph',
  twoColumn: 'Labelled column',
  pullQuote: 'Pull quote',
  image: 'Image',
  imagePair: 'Image pair',
  imageGallery: 'Gallery',
  stats: 'Stats',
  processCards: 'Process cards',
  callout: 'Callout',
  videoEmbed: 'Video embed',
  divider: 'Divider',
}

export const BLOCK_DESCRIPTIONS = {
  heading: 'A section break — big serif or sans heading.',
  paragraph: 'A single paragraph of body copy. Optional lede (larger) variant.',
  twoColumn: 'A small label on the left, a body paragraph on the right.',
  pullQuote: 'Big centered italic quote with attribution.',
  image: 'One image — full-bleed or inset, with an optional caption.',
  imagePair: 'Two side-by-side figures with captions.',
  imageGallery: 'A grid of three to six images with captions.',
  stats: 'Key metrics — numbers + labels in a row.',
  processCards: 'Horizontal-scroll pinned cards for a process or steps.',
  callout: 'A highlighted note or takeaway.',
  videoEmbed: 'An embedded video (YouTube, Vimeo, or MP4).',
  divider: 'Breathing room — a thin rule and whitespace.',
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

const DEFAULTS = {
  heading: () => ({ level: 2, text: 'Section heading', style: 'sans' }),
  paragraph: () => ({ text: 'Write something here.', variant: 'body' }),
  twoColumn: () => ({ label: 'Context', body: 'Set up what the project was about.' }),
  pullQuote: () => ({ text: 'A sentence someone said that mattered.', author: '— Attribution' }),
  image: () => ({ src: '', caption: '', alt: '', layout: 'full' }),
  imagePair: () => ({
    left: { src: '', caption: '' },
    right: { src: '', caption: '' },
  }),
  imageGallery: () => ({ items: [{ src: '', caption: '' }], columns: 3 }),
  stats: () => ({ items: [{ v: '+41%', l: 'Activation' }, { v: '-28%', l: 'Support tickets' }] }),
  processCards: () => ({
    eyebrow: 'Process',
    heading: 'Four moves we made.',
    cards: [
      { k: 'Listening', v: 'A short note.' },
      { k: 'Making', v: 'A short note.' },
    ],
  }),
  callout: () => ({ title: 'Worth holding onto', body: 'A line that captures a principle or a takeaway.' }),
  videoEmbed: () => ({ url: '', caption: '' }),
  divider: () => ({}),
}

export function makeBlock(type) {
  if (!DEFAULTS[type]) throw new Error(`Unknown block type: ${type}`)
  return { id: uid(), type, ...DEFAULTS[type]() }
}

/**
 * Migrate a legacy project (the pre-blocks shape) into a `blocks` array.
 * Keeps the project's hero/cover/meta intact — only builds the body blocks.
 */
export function migrateProjectToBlocks(project) {
  if (Array.isArray(project.blocks) && project.blocks.length) return project.blocks

  const blocks = []

  if (project.contextLede || project.summary) {
    blocks.push({
      id: uid(),
      type: 'twoColumn',
      label: 'Context',
      body: [project.summary, project.contextLede].filter(Boolean).join('\n\n'),
    })
  }

  const gallery = project.gallery || []
  const captions = project.galleryCaptions || []

  if (gallery[0]) {
    blocks.push({ id: uid(), type: 'image', src: gallery[0], caption: '', alt: '', layout: 'full' })
  }
  if (gallery[1] && gallery[2]) {
    blocks.push({
      id: uid(),
      type: 'imagePair',
      left: { src: gallery[1], caption: captions[0] || '' },
      right: { src: gallery[2], caption: captions[1] || '' },
    })
  } else if (gallery[1]) {
    blocks.push({ id: uid(), type: 'image', src: gallery[1], caption: captions[0] || '', alt: '', layout: 'inset' })
  }

  if (project.quote?.text) {
    blocks.push({ id: uid(), type: 'pullQuote', text: project.quote.text, author: project.quote.author || '' })
  }

  if (project.process?.length) {
    blocks.push({
      id: uid(),
      type: 'processCards',
      eyebrow: 'Process',
      heading: 'Four moves we made.',
      cards: project.process,
    })
  }

  if (gallery[3]) {
    blocks.push({ id: uid(), type: 'image', src: gallery[3], caption: '', alt: '', layout: 'full' })
  }

  if (project.outcomes) {
    blocks.push({
      id: uid(),
      type: 'twoColumn',
      label: 'Outcomes',
      body: project.outcomes,
    })
  }

  return blocks
}

export const ALL_BLOCK_TYPES = Object.keys(BLOCK_LABELS)
