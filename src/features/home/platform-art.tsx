import { ChartBarIcon, UsersIcon } from "@phosphor-icons/react/dist/ssr";
import { FaceIcon } from "./face-icon";

/** A dashboard in a browser window: a trend line, a bar chart and two summary cards. */
export function PlatformArt() {
  return (
    <>
      <rect x={8} y={8} width={84} height={84} rx={4} />
      <path d="M8 17h84" />
      <circle cx={13} cy={12.5} r={1.4} />
      <circle cx={18} cy={12.5} r={1.4} />
      <circle cx={23} cy={12.5} r={1.4} />

      <rect x={14} y={23} width={46} height={34} rx={2} />
      <path d="M18 49l8-9 7 5 9-12 7 6 7-8" />

      <rect x={64} y={23} width={22} height={34} rx={2} />
      <path d="M69 52V42M74 52V34M79 52V45M69 52h12" />

      <rect x={14} y={62} width={34} height={24} rx={2} />
      <FaceIcon icon={UsersIcon} x={18} y={66} size={9} />
      <path d="M18 79h22M18 83h14" />

      <rect x={52} y={62} width={34} height={24} rx={2} />
      <FaceIcon icon={ChartBarIcon} x={56} y={66} size={9} />
      <path d="M56 79h22M56 83h12" />
    </>
  );
}
