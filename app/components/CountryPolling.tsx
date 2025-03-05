import React from "react";
import { useState, useEffect } from "react";
import { fetchWikipediaContent, fetchCanadianPollingData, ParsedPollData } from "../services/wikipediaService";
import { PollChart } from "./PollChart";

// Function to get country codes for flag API
function getCountryCode(country: string): string {
  const countryCodes: Record<string, string> = {
    Canada: "CA",
    Ireland: "IE",
    Australia: "AU",
    Germany: "DE",
    "New Zealand": "NZ",
    France: "FR",
    // Add more countries as needed
  };

  return countryCodes[country] || "UN"; // Default to UN flag if country not found
}

interface CountryPollingProps {
  country: string;
  pageTitle: string;
  electionYear: number;
  electionMonth: string;
}

export function CountryPolling({
  country,
  pageTitle,
  electionYear,
  electionMonth,
}: CountryPollingProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    // Only run on client-side to prevent SSR hydration issues
    if (typeof window === 'undefined') return;
    
    const fetchData = async () => {
      try {
        console.log(`Loading data for ${country}...`);
        setLoading(true);
        
        // Fetch Wikipedia page content for description
        const page = await fetchWikipediaContent(pageTitle);
        setContent(page.extract);
        console.log(`Content loaded for ${country}`);
        
        // For Canada, use our specialized polling data fetcher
        if (country === "Canada") {
          console.log("Fetching Canadian polling data...");
          const pollingData = await fetchCanadianPollingData();
          console.log("Canadian polling data received:", pollingData);
          // Convert chart data to poll data points
          const dataPoints = convertToDataPoints(pollingData);
          setChartData(pollingData);
        } else {
          // For other countries, we would implement similar functions
          // but for now they're not implemented
          console.log(`Polling data not implemented for ${country}`);
          setError("Polling data not yet implemented for this country");
        }
        
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching data for ${country}:`, err);
        setError(`Failed to fetch polling data for ${country}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [country, pageTitle]);

  if (loading) {
    return <div className="text-center my-8">Loading polling data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center my-8">{error}</div>;
  }

  if (!chartData && country === "Canada") {
    return <div className="text-red-500 text-center my-8">No polling data available</div>;
  }

  // Calculate the averages and get latest data point for each party
  const partySummary = chartData?.datasets.map((dataset) => {
    const sum = dataset.data.reduce((acc, value) => acc + value, 0);
    const average = (sum / dataset.data.length).toFixed(1);
    const latest = dataset.data[dataset.data.length - 1].toFixed(1);
    return {
      ...dataset,
      average: parseFloat(average),
      latest: parseFloat(latest),
    };
  }) || [];

  // Sort by latest value (descending)
  partySummary.sort((a, b) => b.latest - a.latest);

  // Only render if we have data for this country
  if (!chartData && country !== "Canada") {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <img
            src={`https://flagsapi.com/${getCountryCode(country)}/flat/32.png`}
            alt={`${country} flag`}
            className="mr-2"
          />
          {country} Federal Election Polling ({electionMonth} {electionYear})
        </h2>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p className="text-center py-8">Polling data not yet implemented for {country}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <img
          src={`https://flagsapi.com/${getCountryCode(country)}/flat/32.png`}
          alt={`${country} flag`}
          className="mr-2"
        />
        {country} Federal Election Polling ({electionMonth} {electionYear})
      </h2>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Polling Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {partySummary.map((party) => (
              <div
                key={party.label}
                className="flex items-center bg-gray-50 p-2 rounded border"
                style={{
                  borderLeftColor: party.borderColor,
                  borderLeftWidth: "4px",
                }}
              >
                <div className="flex-1">
                  <div className="font-medium">{party.label}</div>
                  <div>
                    <span className="text-lg font-bold">{party.latest}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {chartData && (
          <PollChart
            title={`${country} Federal Election Polling (${electionMonth} ${electionYear})`}
            labels={chartData.labels}
            datasets={chartData.datasets}
            countryCode={getCountryCode(country)}
            wikipediaPage={pageTitle}
          />
        )}
      </div>
      {content && (
        <div className="mt-4 text-sm">
          <h3 className="font-bold">Source Information:</h3>
          <p className="mt-2">{content.substring(0, 300)}...</p>
          <a
            href={`https://en.wikipedia.org/wiki/${pageTitle.replace(
              / /g,
              "_"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Read more on Wikipedia
          </a>
        </div>
      )}
    </div>
  );
}
