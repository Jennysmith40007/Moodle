const { google } = require('googleapis');
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = process.env.GOOGLE_SHEET_ID;

async function getSheetData(sheetName) {
  const authClient = await auth.getClient();
  const res = await sheets.spreadsheets.values.get({
    auth: authClient,
    spreadsheetId,
    range: sheetName,
  });
  return res.data.values;
}

async function appendToSheet(sheetName, data) {
  const authClient = await auth.getClient();
  await sheets.spreadsheets.values.append({
    auth: authClient,
    spreadsheetId,
    range: sheetName,
    valueInputOption: 'RAW',
    resource: { values: [data] },
  });
}

module.exports = { getSheetData, appendToSheet };