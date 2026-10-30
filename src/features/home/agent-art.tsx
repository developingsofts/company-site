import { ChartLineUpIcon, ChatsCircleIcon, FilesIcon, RobotIcon } from "@phosphor-icons/react/dist/ssr";
import { FaceIcon } from "./face-icon";

/** An agent at the centre, wired to the docs, chat, knowledge graph and metrics it works with. */
export function AgentArt() {
  return (
    <>
      <rect x={12} y={12} width={30} height={20} rx={3} />
      <FaceIcon icon={FilesIcon} x={15} y={15} size={9} />
      <path d="M27 18h11M27 22h9M16 27h20" />

      <rect x={58} y={12} width={30} height={20} rx={3} />
      <FaceIcon icon={ChatsCircleIcon} x={61} y={15} size={9} />
      <path d="M73 18h11M73 22h7M62 27h18" />

      <rect x={39} y={40} width={22} height={22} rx={4} />
      <FaceIcon icon={RobotIcon} x={42} y={43} size={16} />

      <rect x={12} y={60} width={26} height={28} rx={3} />
      <circle cx={18} cy={67} r={2} />
      <circle cx={31} cy={69} r={2} />
      <circle cx={24} cy={81} r={2} />
      <path d="M20 67.3l9 1.4M19 68.7l4 10.5M30 71l-4.8 8.4" />

      <rect x={62} y={60} width={26} height={28} rx={3} />
      <FaceIcon icon={ChartLineUpIcon} x={66} y={64} size={10} />
      <path d="M66 80h18M66 84h12" />

      <path d="M39 47h-12v-15M61 47h12v-15M45 62v11h-7M55 62v11h7" />
    </>
  );
}
