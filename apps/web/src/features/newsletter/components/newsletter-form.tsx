import { useForm, useSelector } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useId } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'
import { postToStrapi, StrapiRequestError } from '@/lib/strapi/public-api'

import {
  newsletterFormSchema,
  type NewsletterFormValues,
  subscribeResultSchema,
} from '../newsletter.schema'

/**
 * The newsletter sign-up: an email and a Subscribe button side by side. It
 * posts straight to Strapi with the page's language, so the confirmation
 * email comes in the reader's language, then asks them to check their inbox.
 */
export function NewsletterForm() {
  const t = useTranslation()
  const lang = useLanguage()
  const id = useId()
  const errorId = `${id}-error`

  const send = useMutation({
    mutationFn: (value: NewsletterFormValues) =>
      postToStrapi(
        '/newsletter/subscribe',
        { ...value, language: lang },
        subscribeResultSchema,
      ),
  })

  const form = useForm({
    defaultValues: { email: '', website: '' },
    validators: { onChange: newsletterFormSchema(t.newsletter.errors) },
    onSubmit: ({ value }) => {
      send.mutate(value)
    },
    onSubmitInvalid: () => {
      document.getElementById(id)?.focus()
    },
  })
  // As in the response form: the error shows once the field is left or the
  // form is sent, not while typing.
  const submitted = useSelector(
    form.store,
    (state) => state.submissionAttempts > 0,
  )

  if (send.isSuccess) {
    return <p role="status">{t.newsletter.sent}</p>
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
      className="flex flex-col gap-2"
    >
      <form.Field name="email">
        {(field) => {
          const error =
            submitted || field.state.meta.isBlurred
              ? field.state.meta.errors[0]?.message
              : undefined
          return (
            <>
              <div className="flex flex-col gap-3 sm:flex-row">
                {/* The card's title says what it's for; the label is for
                    screen readers. */}
                <Label htmlFor={id} className="sr-only">
                  {t.newsletter.email}
                </Label>
                <Input
                  id={id}
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  placeholder={t.newsletter.placeholder}
                  className="h-10 sm:flex-1"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value)
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                />
                <Button type="submit" size="lg" disabled={send.isPending}>
                  {send.isPending
                    ? t.newsletter.sending
                    : t.newsletter.subscribe}
                </Button>
              </div>
              {error && (
                <p id={errorId} className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </>
          )
        }}
      </form.Field>
      {/* The honeypot, as in the response form: hidden from people and
          screen readers, so only bots fill it in. */}
      <form.Field name="website">
        {(field) => (
          <div aria-hidden className="sr-only">
            <input
              tabIndex={-1}
              autoComplete="off"
              name="website"
              value={field.state.value}
              onChange={(event) => {
                field.handleChange(event.target.value)
              }}
            />
          </div>
        )}
      </form.Field>
      {send.isError && (
        <p role="alert" className="text-sm text-destructive">
          {send.error instanceof StrapiRequestError && send.error.status === 429
            ? t.newsletter.errors.tooMany
            : t.newsletter.errors.failed}
        </p>
      )}
    </form>
  )
}
