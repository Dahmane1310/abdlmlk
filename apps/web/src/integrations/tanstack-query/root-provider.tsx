import { QueryClient } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // CMS content changes rarely. Without this, every query refetches
        // right after the page hydrates, duplicating what the server just sent.
        staleTime: 5 * 60 * 1000,
      },
    },
  })

  return {
    queryClient,
  }
}
