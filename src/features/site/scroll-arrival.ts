/**
 * The page scroll at which a section has arrived: its top at the top of the
 * screen, or, for a panel in a sideways chapter (`[data-chapter]` holding a
 * `[data-chapter-track]`), its left edge at the screen's left edge. A chapter
 * moves its track one pixel sideways per pixel scrolled, so a panel arrives
 * as far into the chapter as it sits along the track, up to the chapter's end.
 */
export function arrivalOf(el: HTMLElement): number {
  const chapter = el.closest<HTMLElement>("[data-chapter]");
  const track = chapter?.querySelector<HTMLElement>("[data-chapter-track]");
  if (!chapter || !track) return el.getBoundingClientRect().top + window.scrollY;
  const top = chapter.getBoundingClientRect().top + window.scrollY;
  const travel = Math.max(0, track.scrollWidth - chapter.clientWidth);
  return top + Math.min(el.offsetLeft, travel);
}
