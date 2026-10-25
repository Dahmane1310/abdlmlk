import { createFileRoute } from '@tanstack/react-router'

import { DesignPreview } from '@/components/design-preview'

// Temporary token preview. Deleted in phase 2.
export const Route = createFileRoute('/design')({
  head: () => ({
    meta: [{ title: 'Design tokens' }, { name: 'robots', content: 'noindex' }],
  }),
  component: DesignPreview,
})
