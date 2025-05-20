import { type Transaction } from "../types/transaction";
import { sheets_v4 } from "googleapis";

/* 
  Function to add new month to existing spradsheet.
*/
export async function addMonthToSpreadsheet(
  spreadsheetId: string,
  date: Date | string = new Date()
): Promise<String> {
  // Setup google sheets and auth
  const { google } = require("googleapis");
  const { GoogleAuth } = require("google-auth-library");

  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

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
    const existingSheets =
      (await sheets.spreadsheets?.map(
        (sheet: sheets_v4.Schema$Sheet) => sheet.properties?.title || ""
      )) || [];

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
      range: `${sheetName}!A1:G1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          ["ID", "Date", "Type", "Amount", "Name", "Category", "Description"],
        ],
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
  const { google } = require("googleapis");
  const { GoogleAuth } = require("google-auth-library");

  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

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
      range: `${sheetName}!A:G`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            transaction.id,
            transaction.date,
            transaction.type,
            transaction.amount,
            transaction.name,
            transaction.category,
            transaction.description,
          ],
        ],
      },
    });

    return {
      success: true,
      sheetName,
      transaction,
    };
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
