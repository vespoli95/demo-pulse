import React from 'react';
import { useState, useEffect } from 'react';
import { fetchWikipediaContent } from '../services/wikipediaService';
import { PollChart } from './PollChart';

// Function to get country codes for flag API
function getCountryCode(country: string): string {
  const countryCodes: Record<string, string> = {
    'Canada': 'CA',
    'Ireland': 'IE',
    'Australia': 'AU',
    'Germany': 'DE',
    'New Zealand': 'NZ',
    'France': 'FR',
    // Add more countries as needed
  };
  
  return countryCodes[country] || 'UN'; // Default to UN flag if country not found
}

interface CountryPollingProps {
  country: string;
  pageTitle: string;
  electionYear: number;
}

// Sample data - in a real app, this would be parsed from Wikipedia
const sampleData = {
  'Canada': {
    labels: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025'],
    datasets: [
      {
        label: 'Liberal Party',
        data: [32, 30, 29, 28, 27, 26, 25, 24, 23, 24, 25, 26, 27, 28],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Conservative Party',
        data: [33, 34, 35, 36, 37, 39, 40, 41, 40, 39, 38, 37, 36, 35],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'NDP',
        data: [20, 20, 19, 19, 18, 18, 19, 20, 21, 22, 21, 20, 20, 21],
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      },
    ],
  },
  'Ireland': {
    labels: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025'],
    datasets: [
      {
        label: 'Fine Gael',
        data: [25, 24, 23, 22, 21, 20, 21, 22, 23, 24, 25, 26, 25, 24],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Fianna Fáil',
        data: [18, 19, 20, 21, 22, 23, 24, 25, 24, 23, 22, 21, 20, 19],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Sinn Féin',
        data: [30, 29, 28, 27, 26, 25, 24, 23, 24, 25, 26, 27, 28, 29],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  },
  'Australia': {
    labels: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025'],
    datasets: [
      {
        label: 'Labor Party',
        data: [34, 33, 32, 33, 34, 35, 36, 35, 34, 33, 32, 33, 34, 35],
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
      },
      {
        label: 'Liberal-National Coalition',
        data: [36, 37, 38, 37, 36, 35, 34, 35, 36, 37, 38, 37, 36, 35],
        borderColor: 'rgb(0, 0, 255)',
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
      },
      {
        label: 'Greens',
        data: [12, 13, 14, 13, 12, 11, 12, 13, 14, 13, 12, 11, 12, 13],
        borderColor: 'rgb(0, 128, 0)',
        backgroundColor: 'rgba(0, 128, 0, 0.5)',
      },
    ],
  },
  'Germany': {
    labels: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025'],
    datasets: [
      {
        label: 'CDU/CSU',
        data: [32, 31, 30, 29, 30, 31, 32, 33, 32, 31, 30, 29, 30, 31],
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      {
        label: 'SPD',
        data: [15, 16, 17, 18, 17, 16, 15, 16, 17, 18, 17, 16, 15, 16],
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
      },
      {
        label: 'Greens',
        data: [12, 11, 10, 11, 12, 13, 12, 11, 10, 11, 12, 13, 12, 11],
        borderColor: 'rgb(0, 128, 0)',
        backgroundColor: 'rgba(0, 128, 0, 0.5)',
      },
      {
        label: 'FDP',
        data: [5, 6, 7, 6, 5, 4, 5, 6, 7, 6, 5, 4, 5, 6],
        borderColor: 'rgb(255, 255, 0)',
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
      },
      {
        label: 'AfD',
        data: [19, 20, 21, 20, 19, 18, 19, 20, 21, 20, 19, 18, 19, 20],
        borderColor: 'rgb(0, 0, 255)',
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
      },
    ],
  },
  'New Zealand': {
    labels: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025'],
    datasets: [
      {
        label: 'National Party',
        data: [38, 37, 36, 35, 36, 37, 38, 39, 38, 37, 36, 35, 36, 37],
        borderColor: 'rgb(0, 0, 255)',
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
      },
      {
        label: 'Labour Party',
        data: [26, 27, 28, 29, 28, 27, 26, 25, 26, 27, 28, 29, 28, 27],
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
      },
      {
        label: 'Green Party',
        data: [13, 12, 11, 12, 13, 14, 13, 12, 11, 12, 13, 14, 13, 12],
        borderColor: 'rgb(0, 128, 0)',
        backgroundColor: 'rgba(0, 128, 0, 0.5)',
      },
      {
        label: 'ACT',
        data: [9, 10, 11, 10, 9, 8, 9, 10, 11, 10, 9, 8, 9, 10],
        borderColor: 'rgb(255, 255, 0)',
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
      },
    ],
  },
  'France': {
    labels: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025'],
    datasets: [
      {
        label: 'Renaissance',
        data: [22, 23, 24, 23, 22, 21, 22, 23, 24, 23, 22, 21, 22, 23],
        borderColor: 'rgb(255, 255, 0)',
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
      },
      {
        label: 'National Rally',
        data: [31, 32, 33, 32, 31, 30, 31, 32, 33, 32, 31, 30, 31, 32],
        borderColor: 'rgb(0, 0, 255)',
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
      },
      {
        label: 'The Republicans',
        data: [10, 9, 8, 9, 10, 11, 10, 9, 8, 9, 10, 11, 10, 9],
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
      },
      {
        label: 'France Unbowed',
        data: [18, 17, 16, 17, 18, 19, 18, 17, 16, 17, 18, 19, 18, 17],
        borderColor: 'rgb(128, 0, 128)',
        backgroundColor: 'rgba(128, 0, 128, 0.5)',
      },
    ],
  },
};

export function CountryPolling({ country, pageTitle, electionYear }: CountryPollingProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const page = await fetchWikipediaContent(pageTitle);
        setContent(page.extract);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch polling data');
        setLoading(false);
      }
    };

    fetchData();
  }, [pageTitle]);

  if (loading) {
    return <div className="text-center my-8">Loading polling data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center my-8">{error}</div>;
  }

  // In a real app, we would parse the content to extract actual polling data
  // For this example, we're using sample data
  const data = sampleData[country as keyof typeof sampleData];

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <img 
          src={`https://flagsapi.com/${getCountryCode(country)}/flat/32.png`} 
          alt={`${country} flag`}
          className="mr-2"
        />
        {country} Federal Election Polling ({electionYear})
      </h2>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <PollChart 
          title={`${country} Federal Election Polling (${electionYear})`} 
          labels={data.labels} 
          datasets={data.datasets}
          countryCode={getCountryCode(country)}
        />
      </div>
      {content && (
        <div className="mt-4 text-sm">
          <h3 className="font-bold">Source Information:</h3>
          <p className="mt-2">{content.substring(0, 300)}...</p>
          <a 
            href={`https://en.wikipedia.org/wiki/${pageTitle.replace(/ /g, '_')}`} 
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