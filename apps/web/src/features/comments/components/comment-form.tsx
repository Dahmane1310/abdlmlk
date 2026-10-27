import { useForm, useSelector } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useId } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/lib/i18n/use-language'
import { useTranslation } from '@/lib/i18n/use-translation'
import { postToStrapi, StrapiRequestError } from '@/lib/strapi/public-api'

import {
  commentFormSchema,
  type CommentFormValues,
  commentSentSchema,
} from '../comments.schema'

// The fields a reader fills in, in page order: the first one with an error
// gets the focus after a failed submit.
const FIELDS = ['authorName', 'authorEmail', 'body'] as const

/** A label, the control, then an optional hint and the field's error. */
function FormField({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

/** The ids a control's aria-describedby lists: its hint and its error. */
const describedBy = (id: string, { hint = false, error = false }) =>
  [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') ||
  undefined

/**
 * The response form (DESIGN.md, "Article page"), at the top of the
 * responses. It posts straight to Strapi, which holds the response until the
 * owner approves it; the form then says so instead of showing it.
 */
export function CommentForm({ article }: { article: string }) {
  const t = useTranslation()
  const lang = useLanguage()
  const id = useId()
  const fieldId = (name: (typeof FIELDS)[number]) => `${id}-${name}`

  const send = useMutation({
    mutationFn: (value: CommentFormValues) =>
      postToStrapi(
        '/comments',
        { article, locale: lang, ...value },
        commentSentSchema,
      ),
  })

  const form = useForm({
    defaultValues: { authorName: '', authorEmail: '', body: '', website: '' },
    validators: { onChange: commentFormSchema(t.comments.errors) },
    onSubmit: ({ value }) => {
      send.mutate(value)
    },
    onSubmitInvalid: ({ formApi }) => {
      const first = FIELDS.find(
        (name) => formApi.getFieldMeta(name)?.errors.length,
      )
      if (first) document.getElementById(fieldId(first))?.focus()
    },
  })
  // Errors show once a field is left or the form is sent, not while typing.
  const submitted = useSelector(
    form.store,
    (state) => state.submissionAttempts > 0,
  )
  const errorOf = (meta: {
    isBlurred: boolean
    errors: ({ message: string } | undefined)[]
  }) => (submitted || meta.isBlurred ? meta.errors[0]?.message : undefined)

  if (send.isSuccess) {
    return (
      <p role="status" className="rounded-xl border p-6">
        {t.comments.sent}
      </p>
    )
  }

  const sendError =
    send.error instanceof StrapiRequestError && send.error.status === 429
      ? t.comments.errors.tooMany
      : send.error instanceof StrapiRequestError && send.error.status === 403
        ? t.comments.closed
        : t.comments.errors.failed

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
      className="flex flex-col gap-5 rounded-xl border p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <form.Field name="authorName">
          {(field) => {
            const error = errorOf(field.state.meta)
            return (
              <FormField
                id={fieldId('authorName')}
                label={t.comments.name}
                error={error}
              >
                <Input
                  id={fieldId('authorName')}
                  autoComplete="name"
                  maxLength={80}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value)
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={describedBy(fieldId('authorName'), {
                    error: Boolean(error),
                  })}
                />
              </FormField>
            )
          }}
        </form.Field>
        <form.Field name="authorEmail">
          {(field) => {
            const error = errorOf(field.state.meta)
            return (
              <FormField
                id={fieldId('authorEmail')}
                label={t.comments.email}
                hint={t.comments.emailHint}
                error={error}
              >
                <Input
                  id={fieldId('authorEmail')}
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value)
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={describedBy(fieldId('authorEmail'), {
                    hint: true,
                    error: Boolean(error),
                  })}
                />
              </FormField>
            )
          }}
        </form.Field>
      </div>
      <form.Field name="body">
        {(field) => {
          const error = errorOf(field.state.meta)
          return (
            <FormField
              id={fieldId('body')}
              label={t.comments.response}
              error={error}
            >
              <Textarea
                id={fieldId('body')}
                maxLength={4000}
                dir="auto"
                className="min-h-28"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  field.handleChange(event.target.value)
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy(fieldId('body'), {
                  error: Boolean(error),
                })}
              />
            </FormField>
          )
        }}
      </form.Field>
      {/* The honeypot: off screen and hidden from screen readers, so only
          bots fill it in; the CMS quietly drops anything that has it. */}
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{t.comments.moderation}</p>
        <Button type="submit" size="lg" disabled={send.isPending}>
          {send.isPending ? t.comments.sending : t.comments.publish}
        </Button>
      </div>
      {send.isError && (
        <p role="alert" className="text-sm text-destructive">
          {sendError}
        </p>
      )}
    </form>
  )
}
