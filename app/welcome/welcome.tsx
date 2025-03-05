
import React from "react";

// Define the logos as placeholders
const logoLight = "/logo-light.svg";
const logoDark = "/logo-dark.svg";

// Define the resources for the welcome page
const resources = [
  {
    href: "https://reactrouter.com/",
    text: "React Router Documentation",
    icon: <span className="text-blue-500">📚</span>,
  },
  {
    href: "https://remix.run/",
    text: "Learn more about Remix",
    icon: <span className="text-blue-500">🎵</span>,
  },
  {
    href: "https://reactjs.org/",
    text: "React Documentation",
    icon: <span className="text-blue-500">⚛️</span>,
  },
];

export function Welcome() {
  // Use React.useEffect for any client-side only code
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            {isClient ? (
              <>
                <img
                  src={logoLight}
                  alt="React Router"
                  className="block w-full dark:hidden"
                />
                <img
                  src={logoDark}
                  alt="React Router"
                  className="hidden w-full dark:block"
                />
              </>
            ) : (
              <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            )}
          </div>
        </header>
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
              What&apos;s next?
            </p>
            <ul>
              {resources.map(({ href, text, icon }) => (
                <li key={href}>
                  <a
                    className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {icon}
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}
