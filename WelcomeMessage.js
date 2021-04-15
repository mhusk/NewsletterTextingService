function SendWelcomeMessage(){
  var newMembers = GetNewMembers();
  if(newMembers.length == []){
    Logger.log('SendWelcomeMessage: No new members');
  } else{
    for(var i = 0; i < newMembers.length; i++){
      var member = newMembers[i];
      var row = member[5]
      var phoneNumber = member[1];
      var message = 'Welcome to What You Missed This Week Texting Service!\n -Every Monday at 8:30 AM EST you will recieve a link to the latest newsletter.'
      Logger.log(message)
      sendSms(phoneNumber, message);
      members_SHEET.getRange(row,4).setValue('Sent');
    }
  }
}

function GetNewMembers(){
  var data = members_SHEET.getDataRange().getValues().slice(1);
  var result = [];
  var row = 1;
  for(var i = 0; i < data.length; i++){
    row = row + 1;
    var member = data[i];
    var welcomeStatus = member[3];
    if(welcomeStatus != 'Sent'){
      member.push(row);
      result.push(member);
    }
  }
  return result;
}


