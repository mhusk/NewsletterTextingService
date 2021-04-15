function RemoveUnsubscribedResponses(){
  var unsubcribers = new Sheet(unsubscribe_SHEET).GetSheetData();
  var newResponses = GetNewUnsubscribers(unsubcribers);
  if(newResponses.length == 0){
    Logger.log('RemoveUnsubscribedResponses: No New Data');
  } else{
    for(var i = 0; i < newResponses.length; i++){
      var phoneNumber = newResponses[i];
      RemovePhoneNumbers(phoneNumber, members_SHEET, unsubscribe_SHEET);
    }
  }
}

/**
 * This will remove the specific phone number and row from the Google Sheet.
 * @param {String} phoneNumber
 * @param {SpreadsheetApp.Sheet} memberSheet
 * @param {SpreadsheetApp.Sheet} unsubscriberSheet
 */
function RemovePhoneNumbers(phoneNumber, memberSheet, unsubscriberSheet){
  var members = memberSheet.getDataRange().getValues().slice(1);
  var unsubcribers = unsubscriberSheet.getDataRange().getValues().slice(1);
  var onlyNumbers_UNSUB = unsubcribers.map(function(m){return m[1]});
  var onlyNumbers_MEMBER = members.map(function(m){return m[1]});
  if(onlyNumbers_MEMBER.includes(phoneNumber)){
    var index_MEMBER = onlyNumbers_MEMBER.indexOf(phoneNumber);
    var index_UNSUB = onlyNumbers_UNSUB.indexOf(phoneNumber);
    var row_MEMBER = index_MEMBER + 2;
    var row_UNSUB = index_UNSUB + 2;
    Logger.log(row_UNSUB);
    unsubscriberSheet.getRange(row_UNSUB, 4).setValue('Deleted');
    memberSheet.deleteRow(row_MEMBER);
    var unsubMessage = 'Your number has been removed from the What You Missed This Week Texting List';
    sendSms(phoneNumber, unsubMessage);
  }
}



/**
 * This will return on array of all the people who have unsubscribed.
 * @param {Object[][]} responses
 */
function GetNewUnsubscribers(responses){
  var result = [];
  var row = 1;
  for(var i = 0; i < responses.length; i++){
    row = row + 1;
    if(responses[i][2] != 'verified'){
      var phoneNumber = responses[i][1].toString();
      try{
        var data = lookup(phoneNumber);
        if(data['status'] == 404){
          unsubscribe_SHEET.getRange(row,3).setValue('Not found');
        } else{
          unsubscribe_SHEET.getRange(row,3).setValue('verified');
          unsubscribe_SHEET.getRange(row,2).setValue(data['national_format']);
          result.push(data['national_format']);
        }
      } catch(err){
        Logger.log(err);
        unsubscribe_SHEET.getRange(row,3).setValue('Error with LookUp API');
      }
    }
  }
  return result;
}

class Sheet{
  /**
   * @param {SpreadsheetApp.Sheet} sheet
   */
  constructor(sheet){
    this.sheet = sheet;
  }

  /**
   * This will return the data of a sheet minus the headers.
   */
  GetSheetData(){
    return this.sheet.getDataRange().getValues().slice(1);
  }
}
