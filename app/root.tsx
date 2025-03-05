import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  // Add AdMob script
  {
    rel: "prefetch",
    href: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-PLACEHOLDER-ID",
    // In a real implementation, you would use your actual AdMob publisher ID
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

import { AdBanner } from "./components/AdBanner";
import { SidebarAd } from "./components/SidebarAd";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold">
            Election Polls
          </a>
          <div className="flex gap-4">
            <a href="/" className="hover:underline">
              Home
            </a>
            <a href="/polls" className="hover:underline">
              Polls
            </a>
          </div>
        </div>
      </nav>
      
      {/* Top Ad Banner */}
      <div className="w-full bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto py-2">
          <AdBanner 
            adSlot="top-banner" 
            adFormat="horizontal" 
            style={{ height: '90px', width: '100%' }} 
          />
        </div>
      </div>
      
      {/* Main content with sidebar ad */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row">
        <div className="flex-grow">
          <Outlet />
        </div>
        <div className="hidden lg:block ml-4 mt-8">
          <SidebarAd adSlot="sidebar-ad" height="600px" />
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
