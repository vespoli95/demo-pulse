
import axios from "axios";

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

export interface PollDataPoint {
  date: string;
  values: { [party: string]: number };
}

export interface ParsedPollData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

// Color mapping for political parties
const partyColors: { [key: string]: { border: string; background: string } } = {
  "Liberal Party": {
    border: "rgb(255, 0, 0)",
    background: "rgba(255, 0, 0, 0.5)",
  },
  "Conservative Party": {
    border: "rgb(0, 0, 255)",
    background: "rgba(0, 0, 255, 0.5)",
  },
  "NDP": {
    border: "rgb(255, 165, 0)",
    background: "rgba(255, 165, 0, 0.5)",
  },
  "Bloc Québécois": {
    border: "rgb(75, 192, 192)",
    background: "rgba(75, 192, 192, 0.5)",
  },
  "Green Party": {
    border: "rgb(34, 139, 34)",
    background: "rgba(34, 139, 34, 0.5)",
  },
  // Add other parties as needed
};

export const fetchWikipediaContent = async (pageTitle: string) => {
  try {
    const response = await axios.get<WikipediaResponse>(
      "https://en.wikipedia.org/w/api.php",
      {
        params: {
          action: "query",
          format: "json",
          titles: pageTitle,
          prop: "extracts|revisions",
          explaintext: 1,
          exsectionformat: "plain",
          rvprop: "content",
          rvslots: "main",
          origin: "*",
        },
      }
    );

    const pages = response.data.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId];
  } catch (error) {
    console.error("Error fetching Wikipedia content:", error);
    throw error;
  }
};

export const fetchCanadianPollingData = async (): Promise<ParsedPollData> => {
  try {
    // This would typically fetch from an actual API, but for demonstration purposes,
    // we'll create semi-realistic data based on current trends
    // In a real app, you'd parse the Wikipedia content for tables or use a dedicated polling API
    
    const now = new Date();
    const labels = [];
    const dataPoints: { [party: string]: number[] } = {
      "Liberal Party": [],
      "Conservative Party": [],
      "NDP": [],
      "Bloc Québécois": [],
      "Green Party": [],
    };
    
    // Generate 12 months of data (can be adjusted)
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      labels.push(date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }));
      
      // Generate realistic polling figures based on current trends
      // Add some randomness to simulate polling fluctuation
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
// This is a simplified placeholder
export const parsePollingData = (content: string) => {
  // This is a simplified parser
  // A real implementation would need to handle the specific table format
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
