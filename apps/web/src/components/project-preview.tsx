import Image from "next/image";
import type { RegistryEntry } from "@/lib/registry";

export function ProjectPreview({ entry }: { entry: RegistryEntry }) {
  const { preview } = entry.metadata;

  if (preview.kind === "screenshot" && preview.src) {
    return (
      <Image
        src={preview.src}
        alt={preview.alt}
        width={640}
        height={360}
        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
        className="h-full w-full object-cover"
      />
    );
  }

  const { Preview } = entry;
  return Preview ? <Preview /> : null;
}
