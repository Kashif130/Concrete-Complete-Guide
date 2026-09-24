import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { docs } from "@/content/docs.generated";
import { DocPageClient } from "@/components/DocPageClient";

export function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug.split("/") }));
}

function findDoc(slugParts: string[]) {
  const slug = slugParts.join("/");
  return docs.find((d) => d.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string[] } }): Metadata {
  const doc = findDoc(params.slug);
  return { title: doc ? `${doc.title} — Concrete Guide` : "Concrete Guide" };
}

export default function DocPage({ params }: { params: { slug: string[] } }) {
  const doc = findDoc(params.slug);
  if (!doc) notFound();
  return <DocPageClient doc={doc} />;
}
