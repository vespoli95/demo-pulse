import axios from "axios";

// Define the types for our parsed polling data
export interface ParsedPollData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

// Function to fetch content from Wikipedia's API
export const fetchWikipediaContent = async (pageTitle: string) => {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    pageTitle
  )}`;

  console.log(`Fetching Wikipedia content for: ${pageTitle}`);
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Failed to fetch Wikipedia content: ${response.statusText}`);
    throw new Error("Failed to fetch Wikipedia content");
  }

  const data = await response.json();
  console.log("Successfully fetched Wikipedia content");
  return data;
};


// Predefined party colors for consistency
const partyColors: Record<
  string,
  { border: string; background: string }
> = {
  "Liberal Party": {
    border: "rgb(255, 0, 0)",
    background: "rgba(255, 0, 0, 0.5)",
  },
  "Conservative Party": {
    border: "rgb(0, 0, 255)",
    background: "rgba(0, 0, 255, 0.5)",
  },
  "NDP": {
    border: "rgb(255, 140, 0)",
    background: "rgba(255, 140, 0, 0.5)",
  },
  "Bloc Québécois": {
    border: "rgb(100, 170, 250)",
    background: "rgba(100, 170, 250, 0.5)",
  },
  "Green Party": {
    border: "rgb(0, 128, 0)",
    background: "rgba(0, 128, 0, 0.5)",
  },
};

export const fetchCanadianPollingData = async (): Promise<ParsedPollData> => {
  try {
    console.log("Fetching Canadian polling data...");
    // This would typically fetch from an actual API, but for demonstration purposes,
    // we'll create semi-realistic data based on current trends

    const now = new Date();
    const labels = [];
    const dataPoints: { [party: string]: number[] } = {
      "Liberal Party": [],
      "Conservative Party": [],
      "NDP": [],
      "Bloc Québécois": [],
      "Green Party": [],
    };

    // Generate 12 months of data
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      labels.push(date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }));

      // Generate realistic polling figures based on current trends
      dataPoints["Liberal Party"].push(28 + Math.random() * 4 - 2);
      dataPoints["Conservative Party"].push(38 + Math.random() * 4 - 2);
      dataPoints["NDP"].push(18 + Math.random() * 3 - 1.5);
      dataPoints["Bloc Québécois"].push(8 + Math.random() * 2 - 1);
      dataPoints["Green Party"].push(4 + Math.random() * 1 - 0.5);
    }

    // Convert to the format expected by the chart
    const datasets = Object.keys(dataPoints).map(party => ({
      label: party,
      data: dataPoints[party],
      borderColor: partyColors[party]?.border || "rgb(128, 128, 128)",
      backgroundColor: partyColors[party]?.background || "rgba(128, 128, 128, 0.5)",
    }));

    console.log("Successfully generated Canadian polling data");
    return {
      labels,
      datasets,
    };
  } catch (error) {
    console.error("Error fetching polling data:", error);
    throw error;
  }
};

// In a real implementation, this would parse table data from Wikipedia
export const parsePollingData = (content: string) => {
  console.log("Parsing polling data from Wikipedia content");
  // This is a simplified parser
  const tables = content.match(/{\|[\s\S]*?\|}/g) || [];

  // Basic parsing - would need to be customized based on actual data format
  return tables.map((table) => {
    const rows = table.split("\n|-") || [];
    return rows.map((row) => {
      const cells = row.split("||") || [];
      return cells.map((cell) => cell.trim());
    });
  });
};

export interface PollDataPoint {
  date: string;
  values: { [party: string]: number };
}

interface WikipediaResponse {
  query: {
    pages: {
      [key: string]: {
        title: string;
        extract: string;
        revisions?: Array<{
          content: string;
        }>;
      };
    };
  };
}
// Define the type for parsed poll data
export interface ParsedPollData {
  date: string;
  liberal?: number;
  conservative?: number;
  ndp?: number;
  bloc?: number;
  green?: number;
  peoples?: number;
  other?: number;
}

 