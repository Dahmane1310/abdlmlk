// Zero-width non-joiner: keeps Arabic initials as separate letters instead of
// joining them into what reads like a word. Invisible, no effect on Latin text.
const NON_JOINER = '‌'

/**
 * First letters of the first two words: "Pharmacy Management System" gives "PM".
 * A single word uses its inner capitals instead: "StackInTech" gives "SI".
 */
export function initials(name: string) {
  const words = name.split(/\s+/).filter((word) => /^\p{L}/u.test(word))
  const parts =
    words.length === 1
      ? words.flatMap((word) => word.split(/(?=\p{Lu})/u))
      : words

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join(NON_JOINER)
}
