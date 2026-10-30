import { CloudIcon, ShieldCheckIcon, TerminalWindowIcon } from "@phosphor-icons/react/dist/ssr";
import { FaceIcon } from "./face-icon";

/** A rack of servers, wired to the cloud and a shield, over a terminal that watches them. */
export function InfraArt() {
  return (
    <>
      {[12, 28, 44].map((y) => (
        <g key={y}>
          <rect x={10} y={y} width={46} height={12} rx={2} />
          <path d={`M14 ${y + 4}v4M17 ${y + 4}v4M20 ${y + 4}v4`} />
          <circle cx={46} cy={y + 6} r={1.4} />
          <circle cx={51} cy={y + 6} r={1.4} />
        </g>
      ))}

      <rect x={64} y={12} width={26} height={22} rx={3} />
      <FaceIcon icon={CloudIcon} x={70} y={16} size={14} />

      <rect x={64} y={40} width={26} height={22} rx={3} />
      <FaceIcon icon={ShieldCheckIcon} x={70} y={44} size={14} />

      <path d="M56 18h8M56 50h8" />

      <rect x={10} y={68} width={80} height={22} rx={3} />
      <FaceIcon icon={TerminalWindowIcon} x={14} y={72} size={14} />
      <path d="M33 76h30M33 82h20M77 62v6" />
    </>
  );
}
