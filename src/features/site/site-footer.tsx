import { site } from "@/content/site";
import { typeClass } from "@/lib/type-scale";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <p className={`mx-auto max-w-5xl px-4 py-6 text-muted-foreground ${typeClass("caption")}`}>
        © {site.name}
      </p>
    </footer>
  );
}
