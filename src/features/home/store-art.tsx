import {
  EyeglassesIcon,
  HandbagIcon,
  PackageIcon,
  SneakerIcon,
  TShirtIcon,
  WatchIcon,
} from "@phosphor-icons/react/dist/ssr";
import { FaceIcon } from "./face-icon";

const products = [TShirtIcon, SneakerIcon, HandbagIcon, WatchIcon, EyeglassesIcon, PackageIcon];

/** A storefront's product grid: three across, two deep, each tile a product and its label. */
export function StoreArt() {
  return (
    <>
      {products.map((icon, i) => {
        const x = 8 + (i % 3) * 29;
        const y = 12 + Math.floor(i / 3) * 40;
        return (
          <g key={i}>
            <rect x={x} y={y} width={26} height={36} rx={3} />
            <FaceIcon icon={icon} x={x + 6} y={y + 5} size={14} />
            <path d={`M${x + 4} ${y + 26}h16M${x + 4} ${y + 30}h9`} />
          </g>
        );
      })}
    </>
  );
}
