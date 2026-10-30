import { random } from "./seeded-random";
import { type Kind, kinds } from "./tetrominoes";

/** A seeded 7-bag: every piece once per bag, in shuffled order. */
export interface Bag {
  seed: number;
  queue: readonly Kind[];
}

function shuffle(seed: number): [Kind[], number] {
  const out = [...kinds];
  for (let i = out.length - 1; i > 0; i--) {
    const [r, next] = random(seed);
    seed = next;
    const j = Math.floor(r * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return [out, seed];
}

export function createBag(seed: number): Bag {
  return { seed, queue: [] };
}

export function draw(bag: Bag): [Kind, Bag] {
  if (bag.queue.length > 0) return [bag.queue[0], { seed: bag.seed, queue: bag.queue.slice(1) }];
  const [queue, seed] = shuffle(bag.seed);
  return [queue[0], { seed, queue: queue.slice(1) }];
}
