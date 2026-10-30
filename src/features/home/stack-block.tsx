"use client";

import { type MotionValue, motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { type ReactNode, useEffect } from "react";
import { spring } from "@/lib/springs";
import { followSpring } from "./follow-spring";
import { IsoBlock } from "./iso-block";
import { flightsAt, isolatedPose, stackPose } from "./stack-motion";

interface StackBlockProps {
  index: number;
  count: number;
  /** Stage progress, as `useStageProgress` gives it. */
  progress: MotionValue<number>;
  /** Whether this is the block shown alone. */
  shown: boolean;
  /** Whether another block is shown alone, so this one is cleared away. */
  cleared: boolean;
  art: ReactNode;
}

/** One block of the services stack: the scroll flies it in and stacks it, a pick sets it apart. */
export function StackBlock({ index, count, progress, shown, cleared, art }: StackBlockProps) {
  const reduce = useReducedMotion() ?? false;
  const solo = useSpring(shown ? 1 : 0, followSpring(spring.slow));
  const away = useSpring(cleared ? 1 : 0, followSpring(spring.slow));

  useEffect(() => {
    if (reduce) {
      solo.jump(shown ? 1 : 0);
      away.jump(cleared ? 1 : 0);
    } else {
      solo.set(shown ? 1 : 0);
      away.set(cleared ? 1 : 0);
    }
  }, [shown, cleared, reduce, solo, away]);

  const pose = useTransform(() =>
    isolatedPose(stackPose(flightsAt(progress.get(), count), index, reduce), solo.get(), away.get()),
  );
  const x = useTransform(() => `${pose.get().x * 100}%`);
  const y = useTransform(() => `${pose.get().y * 100}%`);
  const opacity = useTransform(() => pose.get().opacity);
  const fill = useTransform(() => pose.get().fill);
  const ink = useTransform(() => pose.get().ink);
  const ghost = useTransform(() => pose.get().ghost);
  const visibility = useTransform(() => (pose.get().opacity > 0.001 ? "visible" : "hidden"));

  return (
    <motion.div
      data-stack-block={index}
      className="absolute inset-0 will-change-transform"
      style={{ x, y, opacity, visibility }}
    >
      <IsoBlock art={art} fill={fill} ink={ink} ghost={ghost} />
    </motion.div>
  );
}
