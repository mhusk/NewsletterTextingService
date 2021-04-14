class Newsletter{
  /**
   * @param {string} title
   * @param {string} sub
   * @param {string} link
   */
  constructor(title, subtitle, link){
    this.title = title;
    this.subtitle = subtitle;
    this.link = link;
  }
  CreateTwilioMessage(){
    var message = this.title + '\n' + this.subtitle + '\n \n' + this.link;
    return message;
  }
  
  /**
   * This will take in a message and phone number and then send it out to a user.
   * @param {string} phoneNumber
   * @param {string} message
   */
  SendTwilioMessage(phoneNumber, message){
    sendSms(phoneNumber, message);
  }

  /**
   * This will take in the row of the member and update their latest sent status.
   * @param {number} row 
   */
  UpdateSentStatus(row){
    var dateSent = new Date();
    members_SHEET.getRange(row,5, 1, 1).setValue(dateSent)
  }
}

/**
 * Will send the latest newsletter that a user manual updates into their Google Sheet
 */
function SendNewsletter(){
  var title = newsletter_SHEET.getRange('B1').getValue();
  var subtitle = newsletter_SHEET.getRange('B2').getValue();
  var link = newsletter_SHEET.getRange('B3').getValue();
  if(title == '' || subtitle == '' || link == ''){
    Logger.log('Sending Newsletter: One of the fields to send the newsletter is empty.');
  } else{
    var newPost = new Newsletter(title, subtitle,link);
    var message = newPost.CreateTwilioMessage();
    var members = members_SHEET.getDataRange().getValues().slice(1);
    var row = 1;
    for(var i = 0; i < members.length; i++){
      var row = row + 1;
      var memberPhoneNumber = members[i][1];
      newPost.SendTwilioMessage(memberPhoneNumber, message);
      newPost.UpdateSentStatus(row);
    }
  }
}

