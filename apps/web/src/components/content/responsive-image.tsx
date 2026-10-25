import type { Media } from '@/lib/strapi/schemas'

interface ResponsiveImageProps {
  image: Media
  /** How wide the image is shown, e.g. "(min-width: 640px) 50vw, 100vw", so the browser picks a size from srcSet. */
  sizes: string
  className?: string
  /** Load immediately: for images visible without scrolling. */
  priority?: boolean
}

/**
 * A CMS image with every generated size. Width and height reserve its space
 * before it loads, so the page doesn't jump. Without alternative text it's
 * treated as decorative (alt=""), as nearby text already describes it.
 */
export function ResponsiveImage({
  image,
  sizes,
  className,
  priority = false,
}: ResponsiveImageProps) {
  return (
    <img
      src={image.url}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      width={image.width ?? undefined}
      height={image.height ?? undefined}
      alt={image.alternativeText ?? ''}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  )
}
