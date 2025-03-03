
import React from "react";
import { CountryPolling } from "../components/CountryPolling";
import type { Route } from "./+types/polls";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Federal Election Polling Data (2025)" },
    { name: "description", content: "Polling data for federal elections around the world" },
  ];
}

export default function PollsPage() {
  const countries = [
    {
      name: 'Canada',
      pageTitle: 'Opinion polling for the 2025 Canadian federal election',
      flagCode: 'CA',
      electionYear: 2025
    },
    {
      name: 'Ireland',
      pageTitle: 'Next Irish general election',
      flagCode: 'IE',
      electionYear: 2025
    },
    {
      name: 'Australia',
      pageTitle: 'Next Australian federal election',
      flagCode: 'AU',
      electionYear: 2025
    },
    {
      name: 'Germany',
      pageTitle: 'Next German federal election',
      flagCode: 'DE',
      electionYear: 2025
    },
    {
      name: 'New Zealand',
      pageTitle: 'Next New Zealand general election',
      flagCode: 'NZ',
      electionYear: 2026
    },
    {
      name: 'France',
      pageTitle: 'Next French legislative election',
      flagCode: 'FR',
      electionYear: 2027
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-6">Federal Election Polling Data (2025)</h1>
      <p className="text-center text-gray-600 mb-8">
        This page displays polling data for upcoming federal elections around the world.
      </p>
      
      <div className="grid grid-cols-1 gap-8">
        {countries.map((country) => (
          <CountryPolling 
            key={country.name} 
            country={country.name} 
            pageTitle={country.pageTitle}
            electionYear={country.electionYear}
          />
        ))}
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>Data sourced from Wikipedia. Last updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
}
