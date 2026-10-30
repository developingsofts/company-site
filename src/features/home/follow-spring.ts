import type { spring } from "@/lib/springs";

type SpringTier = (typeof spring)[keyof typeof spring];

/**
 * A spring tier as `useSpring` options. The tiers are written for
 * `transition`, which takes seconds; `useSpring` hands its options straight
 * to the spring, which reads `duration` in milliseconds, so a tier passed as
 * is settles in a few milliseconds and the value jumps.
 */
export function followSpring(tier: SpringTier) {
  return { duration: tier.duration * 1000, bounce: tier.bounce };
}
