import { createFileRoute } from "@tanstack/react-router";
import { SeeItWork } from "@/components/SeeItWork";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "See it work — UK legislation, in plain English" },
      {
        name: "description",
        content:
          "See what a UK bill means for your life, and who pushed it through Parliament. Real numbers, sourced to the primary record.",
      },
      { property: "og:title", content: "See it work — UK legislation, in plain English" },
      {
        property: "og:description",
        content:
          "See what a UK bill means for your life, and who pushed it through Parliament.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-white">
      <SeeItWork />
    </main>
  );
}
