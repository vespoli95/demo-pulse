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
    labels: [
      'Jan 3 2024', 'Jan 10 2024', 'Jan 17 2024', 'Jan 24 2024', 
      'Feb 3 2024', 'Feb 10 2024', 'Feb 17 2024', 'Feb 24 2024',
      'Mar 3 2024', 'Mar 10 2024', 'Mar 17 2024', 'Mar 24 2024',
      'Apr 3 2024', 'Apr 10 2024', 'Apr 17 2024', 'Apr 24 2024',
      'May 3 2024', 'May 10 2024', 'May 17 2024', 'May 24 2024',
      'Jun 3 2024', 'Jun 10 2024', 'Jun 17 2024', 'Jun 24 2024',
      'Jul 3 2024', 'Jul 10 2024', 'Jul 17 2024', 'Jul 24 2024',
      'Aug 3 2024', 'Aug 10 2024', 'Aug 17 2024', 'Aug 24 2024',
      'Sep 3 2024', 'Sep 10 2024', 'Sep 17 2024', 'Sep 24 2024',
      'Oct 3 2024', 'Oct 10 2024', 'Oct 17 2024', 'Oct 24 2024',
      'Nov 3 2024', 'Nov 10 2024', 'Nov 17 2024', 'Nov 24 2024',
      'Dec 3 2024', 'Dec 10 2024', 'Dec 17 2024', 'Dec 24 2024',
      'Jan 3 2025', 'Jan 10 2025', 'Jan 17 2025', 'Jan 24 2025',
      'Feb 3 2025', 'Feb 10 2025', 'Feb 17 2025', 'Feb 24 2025'
    ],
    datasets: [
      {
        label: 'Liberal Party',
        data: [
          32.1, 31.8, 31.5, 31.2, 
          30.9, 30.6, 30.3, 30.0, 
          29.7, 29.4, 29.1, 28.8, 
          28.5, 28.3, 28.1, 27.9, 
          27.7, 27.5, 27.3, 27.1, 
          26.8, 26.5, 26.2, 25.9, 
          25.6, 25.4, 25.2, 25.0, 
          24.7, 24.4, 24.1, 23.8, 
          23.5, 23.3, 23.2, 23.0, 
          23.3, 23.6, 23.9, 24.2, 
          24.5, 24.8, 25.1, 25.4, 
          25.7, 26.0, 26.3, 26.6, 
          26.9, 27.2, 27.5, 27.8, 
          28.1, 28.4, 28.7, 29.0
        ],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Conservative Party',
        data: [
          33.2, 33.5, 33.8, 34.1, 
          34.4, 34.7, 35.0, 35.3, 
          35.6, 35.9, 36.2, 36.5, 
          36.8, 37.1, 37.4, 37.7, 
          38.0, 38.3, 38.6, 38.9, 
          39.2, 39.5, 39.8, 40.1, 
          40.4, 40.7, 41.0, 41.3, 
          41.1, 40.9, 40.7, 40.5, 
          40.3, 40.1, 39.9, 39.7, 
          39.5, 39.3, 39.1, 38.9, 
          38.7, 38.5, 38.3, 38.1, 
          37.9, 37.7, 37.5, 37.3, 
          37.1, 36.9, 36.7, 36.5, 
          36.0, 35.7, 35.4, 35.1
        ],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'NDP',
        data: [
          20.0, 20.0, 20.0, 20.0, 
          20.0, 19.9, 19.8, 19.7, 
          19.6, 19.5, 19.4, 19.3, 
          19.2, 19.1, 19.0, 18.9, 
          18.8, 18.7, 18.6, 18.5, 
          18.4, 18.3, 18.2, 18.1, 
          18.2, 18.4, 18.6, 18.8, 
          19.0, 19.2, 19.4, 19.6, 
          19.8, 20.0, 20.2, 20.4, 
          20.6, 20.8, 21.0, 21.2, 
          21.4, 21.6, 21.8, 22.0, 
          21.8, 21.6, 21.4, 21.2, 
          21.0, 20.8, 20.6, 20.4, 
          20.8, 20.9, 21.0, 21.1
        ],
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      },
      {
        label: 'Bloc Québécois',
        data: [
          7.8, 7.8, 7.9, 7.9, 
          8.0, 8.0, 8.1, 8.1, 
          8.2, 8.2, 8.2, 8.3, 
          8.3, 8.3, 8.4, 8.4, 
          8.4, 8.5, 8.5, 8.5, 
          8.6, 8.6, 8.7, 8.7, 
          8.7, 8.8, 8.8, 8.8, 
          8.8, 8.9, 8.9, 8.9, 
          9.0, 9.0, 9.0, 9.0, 
          9.1, 9.1, 9.1, 9.1, 
          9.1, 9.0, 9.0, 9.0, 
          8.9, 8.9, 8.8, 8.8, 
          8.7, 8.7, 8.6, 8.6, 
          8.5, 8.5, 8.4, 8.4
        ],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Green Party',
        data: [
          3.5, 3.5, 3.4, 3.4, 
          3.3, 3.3, 3.3, 3.2, 
          3.2, 3.2, 3.1, 3.1, 
          3.1, 3.0, 3.0, 3.0, 
          3.0, 3.1, 3.1, 3.1, 
          3.2, 3.2, 3.2, 3.3, 
          3.3, 3.3, 3.4, 3.4, 
          3.4, 3.5, 3.5, 3.5, 
          3.6, 3.6, 3.6, 3.7, 
          3.7, 3.7, 3.8, 3.8, 
          3.8, 3.8, 3.7, 3.7, 
          3.7, 3.6, 3.6, 3.6, 
          3.5, 3.5, 3.4, 3.4, 
          3.4, 3.3, 3.3, 3.3
        ],
        borderColor: 'rgb(34, 139, 34)',
        backgroundColor: 'rgba(34, 139, 34, 0.5)',
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
      {
        label: 'Green Party',
        data: [5, 5, 4, 4, 5, 5, 6, 6, 5, 5, 4, 4, 5, 5],
        borderColor: 'rgb(34, 139, 34)',
        backgroundColor: 'rgba(34, 139, 34, 0.5)',
      },
      {
        label: 'Labour Party',
        data: [4, 5, 5, 6, 6, 5, 5, 4, 4, 5, 5, 6, 6, 5],
        borderColor: 'rgb(255, 0, 0)',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
      },
      {
        label: 'Independents',
        data: [13, 13, 14, 14, 13, 13, 12, 12, 13, 13, 14, 14, 13, 13],
        borderColor: 'rgb(128, 128, 128)',
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
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
      {
        label: 'One Nation',
        data: [6, 6, 5, 5, 6, 6, 7, 7, 6, 6, 5, 5, 6, 6],
        borderColor: 'rgb(255, 165, 0)',
        backgroundColor: 'rgba(255, 165, 0, 0.5)',
      },
      {
        label: 'United Australia Party',
        data: [4, 4, 3, 3, 4, 4, 3, 3, 4, 4, 5, 5, 4, 4],
        borderColor: 'rgb(255, 255, 0)',
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
      },
      {
        label: 'Independents',
        data: [8, 7, 8, 9, 8, 9, 8, 7, 6, 7, 8, 9, 8, 7],
        borderColor: 'rgb(128, 128, 128)',
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
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
      {
        label: 'Die Linke',
        data: [4, 4, 5, 5, 4, 4, 3, 3, 4, 4, 5, 5, 4, 4],
        borderColor: 'rgb(128, 0, 0)',
        backgroundColor: 'rgba(128, 0, 0, 0.5)',
      },
      {
        label: 'BSW',
        data: [7, 8, 8, 7, 7, 6, 6, 7, 7, 8, 8, 7, 7, 6],
        borderColor: 'rgb(128, 0, 128)',
        backgroundColor: 'rgba(128, 0, 128, 0.5)',
      },
      {
        label: 'Others',
        data: [5, 4, 3, 4, 5, 6, 7, 6, 5, 4, 3, 4, 5, 6],
        borderColor: 'rgb(128, 128, 128)',
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
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
      {
        label: 'NZ First',
        data: [7, 7, 8, 8, 7, 7, 6, 6, 7, 7, 8, 8, 7, 7],
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      {
        label: 'Māori Party',
        data: [3, 3, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 3, 3],
        borderColor: 'rgb(139, 69, 19)',
        backgroundColor: 'rgba(139, 69, 19, 0.5)',
      },
      {
        label: 'TOP',
        data: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        borderColor: 'rgb(128, 0, 128)',
        backgroundColor: 'rgba(128, 0, 128, 0.5)',
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
      {
        label: 'Socialist Party',
        data: [7, 7, 8, 8, 7, 7, 6, 6, 7, 7, 8, 8, 7, 7],
        borderColor: 'rgb(255, 105, 180)',
        backgroundColor: 'rgba(255, 105, 180, 0.5)',
      },
      {
        label: 'Greens',
        data: [5, 5, 4, 4, 5, 5, 6, 6, 5, 5, 4, 4, 5, 5],
        borderColor: 'rgb(0, 128, 0)',
        backgroundColor: 'rgba(0, 128, 0, 0.5)',
      },
      {
        label: 'Communist Party',
        data: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        borderColor: 'rgb(139, 0, 0)',
        backgroundColor: 'rgba(139, 0, 0, 0.5)',
      },
      {
        label: 'Others',
        data: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        borderColor: 'rgb(128, 128, 128)',
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
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
  const rawData = sampleData[country as keyof typeof sampleData];
  
  // Calculate the averages for each party
  const averages = rawData.datasets.map(dataset => {
    const sum = dataset.data.reduce((acc, value) => acc + value, 0);
    const average = (sum / dataset.data.length).toFixed(1);
    return {
      ...dataset,
      average: parseFloat(average)
    };
  });
  
  // Sort by average value (descending)
  averages.sort((a, b) => b.average - a.average);
  
  const data = rawData;

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
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Polling Average</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {averages.map((party) => (
              <div 
                key={party.label} 
                className="flex items-center bg-gray-50 p-2 rounded border"
                style={{ borderLeftColor: party.borderColor, borderLeftWidth: '4px' }}
              >
                <div className="flex-1">
                  <div className="font-medium">{party.label}</div>
                  <div className="text-lg font-bold">{party.average}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
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