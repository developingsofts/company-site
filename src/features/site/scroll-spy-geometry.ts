/** A scroller along one axis, in px. */
export interface ScrollView {
  /** Visible length along the axis. */
  size: number;
  scroll: number;
  /** Largest scroll offset. */
  max: number;
}

/** Where a section starts, measured from the scroller's visible start. */
export interface SectionEdge {
  id: string;
  start: number;
}

// The read line slides from `offset` at the start of the scroll to the far
// edge at the end, so the last section can become active even when it is too
// short to ever reach `offset`, and each step of scroll moves it as far as
// the content does.
function readLine(view: ScrollView, offset: number): number {
  const ratio = view.max > 0 ? Math.min(1, Math.max(0, view.scroll / view.max)) : 1;
  return offset + ratio * Math.max(0, view.size - offset - 1);
}

/** The section being read: the last one whose left edge has passed the read line. */
export function activeSection(sections: readonly SectionEdge[], view: ScrollView, offset: number): string {
  if (sections.length === 0) return "";
  if (view.max - view.scroll <= 2) return sections[sections.length - 1].id;
  const line = readLine(view, offset);
  let current = sections[0].id;
  for (const s of sections) if (s.start <= line + 1) current = s.id;
  return current;
}

/**
 * Where to scroll to show a section, given its start and the next section's,
 * in content coordinates: its start at the scroller's start, clamped to the
 * scroll range, unless that would let the next section reach the read line;
 * then as far as it can go while it is still the one read.
 */
export function scrollForSection(
  start: number,
  nextStart: number | undefined,
  view: ScrollView,
  offset: number,
): number {
  if (view.max <= 0) return 0;
  const travel = Math.max(0, view.size - offset - 1);
  // The scroll at which an edge meets the read line: the line moves with the
  // scroll, so this solves `edge - scroll = readLine(scroll)` for `scroll`.
  const reaches = (edge: number) => (edge - offset) / (1 + travel / view.max);
  const latest = nextStart === undefined ? view.max : reaches(nextStart) - 1;
  const scroll = Math.max(reaches(start), Math.min(start, latest));
  return Math.min(view.max, Math.max(0, scroll));
}
