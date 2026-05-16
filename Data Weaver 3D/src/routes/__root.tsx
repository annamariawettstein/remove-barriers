import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f1e7] px-4 text-[#0f2a1f]">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold tracking-tight">
          404<span className="text-[#0f4d33]">.</span>
        </h1>
        <h2 className="mt-4 text-xl font-bold">
          <span className="font-serif italic font-normal text-[#0f4d33]">Nothing</span> to expose here
        </h2>
        <p className="mt-2 text-sm text-[#0f2a1f]/65">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-[#0f4d33] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3f1e7] transition-colors hover:bg-[#0a3a26]"
          >
            Back to Exposé →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f1e7] px-4 text-[#0f2a1f]">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          This page didn't <span className="font-serif italic font-normal text-[#0f4d33]">load</span>.
        </h1>
        <p className="mt-2 text-sm text-[#0f2a1f]/65">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-sm bg-[#0f4d33] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3f1e7] transition-colors hover:bg-[#0a3a26]"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-[#0f2a1f]/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f2a1f] transition-colors hover:border-[#0f4d33] hover:text-[#0f4d33]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
