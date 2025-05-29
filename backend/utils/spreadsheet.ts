import { type Transaction } from "../types/transaction";
import { google, sheets_v4 } from "googleapis";
import { GoogleAuth } from "google-auth-library";

/* 
  Create authentication using environment variables
*/
function createAuth() {
  return new GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Needed to convert to actual newlines
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

/* 
  Function to add new month to existing spradsheet.
*/
export async function addMonthToSpreadsheet(
  spreadsheetId: string,
  date: Date | string = new Date()
): Promise<String> {
  // Setup google sheets and auth
  const auth = createAuth();
  const sheets = google.sheets({ version: "v4", auth });

  // Convert to Date object if it's a string
  const transactionDate = typeof date === "string" ? new Date(date) : date;

  // Format the sheet name on current date
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const sheetName = `${
    monthNames[transactionDate.getMonth()]
  } ${transactionDate.getFullYear()}`;

  try {
    // Get existing sheets to check if month already exists
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const existingSheets =
      spreadsheet.data.sheets?.map(
        (sheet: sheets_v4.Schema$Sheet) => sheet.properties?.title || ""
      ) || [];

    // If the sheet already exists, nothing to do
    if (existingSheets.includes(sheetName)) {
      console.log(`Sheet ${sheetName} already exists`);
      return sheetName;
    }

    // Sheet doesn't exist, create it using our helper function
    return await createNewSheet(sheets, spreadsheetId, sheetName);
  } catch (error) {
    console.error("Error adding month to spreadsheet:", error);
    throw error;
  }
}

/* 
  Creates a new sheet in the spreadsheet with proper headers and formatting
*/
export async function createNewSheet(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetName: string
): Promise<String> {
  try {
    // Create the new sheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: { title: sheetName },
            },
          },
        ],
      },
    });

    // Add headers to the new sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:F1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["Date", "Name", "Type", "Category", "Amount", "Description"]],
      },
    });

    // Format the header row to be bold with background
    // Get updated spreadsheet data to get the new sheet ID
    const updatedSpreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetId = getSheetIdByTitle(updatedSpreadsheet.data, sheetName);

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.8,
                    green: 0.8,
                    blue: 0.9,
                  },
                  textFormat: {
                    bold: true,
                  },
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat)",
            },
          },
        ],
      },
    });

    console.log(`Sheet ${sheetName} created successfully`);
    return sheetName;
  } catch (error) {
    console.error(`Error creating sheet ${sheetName}:`, error);
    throw error;
  }
}

// Helper function to get sheet ID by title
function getSheetIdByTitle(
  spreadsheet: sheets_v4.Schema$Spreadsheet,
  title: string
) {
  const sheet = spreadsheet.sheets?.find((s) => s.properties?.title === title);
  return sheet?.properties?.sheetId || null;
}

/* 
  Function to add a transaction to the spreadsheet.
  Creates the monthly sheet if needed.
*/
export async function addTransaction(transaction: Transaction) {
  // Setup google sheets and auth
  const auth = createAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SPREADSHEET_ID as string;

  try {
    // Ensure the month sheet exists, create it if not
    const sheetName = await addMonthToSpreadsheet(
      spreadsheetId,
      transaction.date
    );

    // Add the transaction to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:F`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            transaction.date,
            transaction.name,
            transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),  // Capitalize transaction type
            transaction.category,
            transaction.amount,
            transaction.description || "",
          ],
        ],
      },
    });


  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
}

/* 
  Validates that transaction has required fields.
*/
export function isValidTransaction(transaction: Transaction) {
  return (
    transaction &&
    typeof transaction.date === "string" &&
    (transaction.type === "income" || transaction.type === "expense") &&
    typeof transaction.amount === "number" &&
    typeof transaction.name === "string" &&
    typeof transaction.category === "string"
  );
}

/* 
  Function to fetch transactions for a specific month
*/
export async function getTransactionsForMonth(month: number, year: number) {
  const auth = createAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const sheetName = `${monthNames[month]} ${year}`;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:F`
    });

    const rows = response.data.values;

    // If no data, or only headers, return empty array
    if (!rows || rows.length <= 1) {
      return [];
    }

    // Convert rows to transaction objects (skipping header row)
    const transactions = rows.slice(1).map((row, index) => ({
      id: index + 1,
      date: row[0],
      name: row[1],
      type: row[2],
      category: row[3],
      amount: parseFloat(row[4]) || 0,
      description: row[5] || ""
    }));

    return transactions
  } catch (error) {
    // Sheet doesn't exist for this month, so return empty array
    console.log(`No data found for ${sheetName}`);
    return [];
  }
}