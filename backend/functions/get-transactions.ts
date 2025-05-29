import { Handler } from "@netlify/functions";
import { getTransactionsForMonth } from "../utils/spreadsheet";

export const handler: Handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Get query parameters for month/year (default to current)
    const queryParams = event.queryStringParameters || {};
    const month =
      parseInt(queryParams.month || "", 10) || new Date().getMonth();
    const year =
      parseInt(queryParams.year || "", 10) || new Date().getFullYear();

    const transactions = await getTransactionsForMonth(month, year);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sucess: true,
        transactions,
        month,
        year,
      }),
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to fetch transactions",
        message: error instanceof Error ? error.message : "Unknown Error",
      }),
    };
  }
};
