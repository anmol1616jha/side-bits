import Link from "next/link";
import { Container } from "@side-bits/ui";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description: `What ${siteConfig.name} is, how the projects are built, and what happens to your data.`,
  path: "/about",
});

const principles = [
  {
    title: "Each bit stands on its own",
    body: "Every project explains what it does, how to use it and what happens to anything you type into it.",
  },
  {
    title: "Your data stays put",
    body: "The current projects run entirely in your browser. Nothing you enter is sent to a server or stored. If a future project needs to send data somewhere, it will say what, where and why before you submit anything.",
  },
  {
    title: "No accounts, no analytics",
    body: "There is nothing to sign up for and no tracking scripts. Your theme choice is saved in your own browser, and only if you change it.",
  },
  {
    title: "Honest labels",
    body: "Experimental projects are marked as experimental. Projects that stop being maintained are retired, not quietly left to rot.",
  },
];

export default function AboutPage() {
  return (
    <Container width="reading" className="py-12 sm:py-16">
      <h1 className="font-display text-display-xl font-semibold tracking-tight">About</h1>
      <div className="mt-6 space-y-4 text-lg text-text-muted">
        <p>
          {siteConfig.name} is a small public playground: useful little tools, odd experiments and
          websites that exist mostly because they could. Some will save you time. Others are a
          pleasant way to lose some.
        </p>
        <p>
          Projects are small on purpose. Each one does a single thing and should make sense without
          a manual.
        </p>
      </div>

      <h2 className="mt-12 font-display text-display-md font-semibold">Ground rules</h2>
      <dl className="mt-6 space-y-6">
        {principles.map((principle) => (
          <div key={principle.title}>
            <dt className="font-semibold">{principle.title}</dt>
            <dd className="mt-1 text-text-muted">{principle.body}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-12">
        <Link href="/explore" className="font-medium text-accent underline underline-offset-4">
          Go explore the bits
        </Link>
      </p>
    </Container>
  );
}
