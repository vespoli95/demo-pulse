
import React from "react";
import { CountryPolling } from "../components/CountryPolling";
import type { Route } from "./+types/polls";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Federal Election Polling Data" },
    { name: "description", content: "Polling data for federal elections around the world" },
  ];
}

export default function PollsPage() {
  const countries = [
    {
      name: 'Canada',
      pageTitle: 'Opinion polling for the 2025 Canadian federal election',
      flagCode: 'CA',
    },
    {
      name: 'Ireland',
      pageTitle: 'Next Irish general election',
      flagCode: 'IE',
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-6">Federal Election Polling Data</h1>
      <p className="text-center text-gray-600 mb-8">
        This page displays polling data for upcoming federal elections around the world.
      </p>
      
      <div className="grid grid-cols-1 gap-8">
        {countries.map((country) => (
          <CountryPolling 
            key={country.name} 
            country={country.name} 
            pageTitle={country.pageTitle} 
          />
        ))}
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>Data sourced from Wikipedia. Last updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
}
