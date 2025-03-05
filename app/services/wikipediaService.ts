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
