var ss = GetSpreadsheet(spreadsheetID);
var response_SHEET = GetSheet('Form Responses',ss);
var members_SHEET = GetSheet('Members', ss);
var newsletter_SHEET = GetSheet('Newsletter', ss);

/**
 * This will return a Google Sheet based on the sheet's ID
 * @param {string} ID - this is the ID for the sheet
 */
function GetSpreadsheet(ID){
  try {
    var spreadsheet = SpreadsheetApp.openById(ID);
    return spreadsheet;
  } catch (error) {
    Logger.log('Not a valid Spreadsheet ID');
  }
}

/**
 * This will get the sheet you want based on name
 * @param {string} name - this is the name of the sheet you want
 * @param {SpreadsheetApp.Spreadsheet} spreadsheet - this is the spreadsheet you want to get the sheet from
 */
function GetSheet(name, spreadsheet){
  var sheet = spreadsheet.getSheetByName(name);
  if(sheet != null){
    return sheet;
  } else{
    Logger.log('The sheet with the name: ' + name +' does not exist');
  }
}
