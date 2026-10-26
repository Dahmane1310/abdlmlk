// The strip layout (DESIGN.md, "Strip"), shared by FactsStrip and MetricGrid.
// It sits in PageHeader's transition band, whose edges frame it: thin dividers
// between cells, the first cell of each row flush with the text above. Two
// cells per row on phones, one row on large screens.
export const STRIP_CLASS =
  'grid grid-cols-2 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none'

// Phones: the even (second) cell of each row gets the divider, later rows a
// top line. Large screens: every cell but the first gets the divider. Written
// so no two rules compete for the same cell.
export const STRIP_CELL_CLASS =
  'py-7 pe-4 even:border-s even:ps-6 nth-[n+3]:border-t lg:not-first:border-s lg:not-first:ps-6 lg:nth-[n+3]:border-t-0'
