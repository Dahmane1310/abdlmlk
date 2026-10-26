import type { Service } from '../services.schema'
import { ServiceIcon } from './service-icon'

/**
 * Services as a borderless grid (DESIGN.md, "Services"): the icon and a mono
 * index, the title, then a grey summary. Space separates them, not lines.
 */
export function ServiceList({ services }: { services: Service[] }) {
  return (
    <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <li key={service.slug} className="flex flex-col gap-2.5">
          <div className="flex items-center">
            <ServiceIcon name={service.icon} className="size-6 text-primary" />
            {/* Decorative order, like the section numbers. */}
            <span
              aria-hidden
              className="ms-auto font-mono text-xs text-muted-foreground"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <h3 className="mt-1 text-lg leading-snug font-semibold">
            {service.title}
          </h3>
          <p className="text-[0.9375rem] text-muted-foreground">
            {service.summary}
          </p>
        </li>
      ))}
    </ul>
  )
}
