import Link from "next/link";
import { site } from "@/content/site";
import { fontWeights } from "@/lib/font-weight";
import { typeClass } from "@/lib/type-scale";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className={typeClass("title")}
          style={{ fontVariationSettings: fontWeights.semibold }}
        >
          {site.name}
        </Link>
      </div>
    </header>
  );
}
