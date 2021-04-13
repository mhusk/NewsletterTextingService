var ss = GetSpreadsheet(spreadsheetID);
var response_SHEET = GetSheet('Form Responses',ss);
var globalVars_SHEET = GetSheet('globalVars', ss);
var textingServiceMembers_SHEET = GetSheet('TextingServiceMembers', ss);



function main(){
  ValidateFormResponses(response_SHEET, globalVars_SHEET); //Update this function to not have to rely on global variables. Make it rely on looking through the responses for unverified rows.
  MoveVerifiedResponses(response_SHEET, textingServiceMembers_SHEET);
}


/**
 * This will validate new form responses
 * @param {SpreadsheetApp.Spreadsheet} formResponseSheet - sheet with the form responses
 * @param {SpreadsheetApp.Spreadsheet} memberSheet - Sheet that includes all the members
 */
function MoveVerifiedResponses(formResponseSheet, memberSheet){
  var rows = GetRowOfLastMoved(formResponseSheet);
  if(rows.length != 0){
    var row = memberSheet.getDataRange().getValues().length + 1; // last row with a value in it.
    for(var i = 0; i < rows.length; i++){
      var name = formResponseSheet.getRange(rows[i],2,1,1).getValues()[0][0];
      var number = formResponseSheet.getRange(rows[i],3,1,1).getValues()[0][0];
      var dateAdded = formResponseSheet.getRange(rows[i],1,1,1).getValues()[0][0];
      var isDuplicate = CheckForDuplicate(number, memberSheet);
      if(isDuplicate != true){
        var memberData = [name, number, dateAdded];
        memberSheet.getRange(row, 1, 1, memberData.length).setValues([memberData]);
        formResponseSheet.getRange(rows[i],5,1,1).setValue('moved');
        var row = row + 1;
      } else{
        formResponseSheet.getRange(rows[i],5,1,1).setValue('duplicate');
      }
    }
  } else{
    Logger.log('MoveVerifiedResponse: No Responses to Move')
  }
}

/**
 * This will check to see if the phone number already exists in the record
 * @param {Object} number - this is the phone number I am checking.
 * @param {SpreadsheetApp.Spreadsheet} memberSheet - Sheet that includes all the members
 * @returns {bool} if the number already exists.
 */
function CheckForDuplicate(number, memberSheet){
  var memberNumbers = [];
  var memberData = memberSheet.getDataRange().getValues().slice(1);
  //var phoneNumber = memberData[0][1];
  for(var i = 0; i < memberData.length; i++){
    memberNumbers.push(memberData[i][1]);
  }
  return memberNumbers.includes(number)
}


/**
 * this will find the rows of verified responses that have not been moved.
 * @param {SpreadsheetApp.Spreadsheet} formResponseSheet - sheet with the form responses
 * @returns {number[]}
 */
function GetRowOfLastMoved(formResponseSheet){
  var rows = [];
  var row = 1;
  var formResponses = formResponseSheet.getDataRange().getValues().slice(1);
  for(var i = 0; i < formResponses.length; i++){
    row = row + 1;
    var verified = formResponses[i][3];
    var moved = formResponses[i][4];
    if(verified == 'verified' && moved == ''){
      rows.push(row);
    }
  }
  return rows;
}


/**
 * This will validate new form responses
 * @param {SpreadsheetApp.Spreadsheet} formResponses - sheet with the form responses
 * @param {SpreadsheetApp.Spreadsheet} globalVars - sheet with global variables
 */
function ValidateFormResponses(formResponses, globalVars){
  var status_COL = 4;
  var phoneNumber_COL = 3;

  var rowsOfNewResponses = GetNewResponses(formResponses);
  
  if(rowsOfNewResponses.length == 0){
    Logger.log('ValidateFormResponses: No new data');
  } else{
    for(var i = 0; i < rowsOfNewResponses.length; i++){
      var row = rowsOfNewResponses[i];
      var phoneNumber = formResponses.getRange(row, phoneNumber_COL,1,1).getValue().toString();
      try{
        var data = lookup(phoneNumber);
        if(data['status'] == 404){
          formResponses.getRange(row,status_COL).setValue('not found');
        } else{
          formResponses.getRange(row, status_COL).setValue('verified');
          formResponses.getRange(row, phoneNumber_COL).setValue(data['national_format']);
        }
      } catch(err){
        Logger.log(err);
        formResponses.getRange(row,status_COL).setValue('Error with LookUp Function');
      }
    }
  }
}

/**
 * This will return the rows of new responses that have not been verified.
 * @param {SpreadsheetApp.Spreadsheet} formResponseSheet - sheet with the form responses
 */
function GetNewResponses(formResponseSheet){
  var rows = [];
  var row = 1;
  var formResponses = formResponseSheet.getDataRange().getValues().slice(1);
  for(var i = 0; i < formResponses.length; i++){
    row = row + 1;
    var verified = formResponses[i][3];
    var phoneNumber = formResponses[i][2];
    if(verified == '' && phoneNumber != ''){
      rows.push(row);
    }
  }
  return rows;
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
