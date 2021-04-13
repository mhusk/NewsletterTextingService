/**
 * look up a phone number via Twilio API and will let you know if it is a valid phone number
 * and then it will convert it to the proper format
 * Link to Tutorial:
 * https://www.twilio.com/blog/2016/03/how-to-look-up-and-verify-phone-numbers-in-google-spreadsheets-with-javascript.html
 */
function lookup(phoneNumber) {
    var lookupUrl = "https://lookups.twilio.com/v1/PhoneNumbers/" + phoneNumber + "?Type=carrier"; 

    var options = {
        "method" : "get"
    };

    options.headers = {    
        Authorization : "Basic " + Utilities.base64Encode(TWILIO_ACCOUNT_SID+':'+TWILIO_AUTH_TOKEN)
    };

    var response = UrlFetchApp.fetch(lookupUrl, options);
    var data = JSON.parse(response); 
    //Logger.log(data); 
    return data; 
}



/**
 * Sends a message to a given phone number via SMS through Twilio.
 * To learn more about sending an SMS via Twilio and Sheets: 
 * https://www.twilio.com/blog/2016/02/send-sms-from-a-google-spreadsheet.html
 *
 * @param {number} phoneNumber - phone number to send SMS to.
 * @param {string} message - text to send via SMS.
 * @return {string} status of SMS sent (successful sent date or error encountered).
 */
function sendSms(phoneNumber, message) {
  var twilioUrl = 'https://api.twilio.com/2010-04-01/Accounts/' + TWILIO_ACCOUNT_SID + '/Messages.json';

  try {
    UrlFetchApp.fetch(twilioUrl, {
      method: 'post',
      headers: {
        Authorization: 'Basic ' + Utilities.base64Encode(TWILIO_ACCOUNT_SID+':'+TWILIO_AUTH_TOKEN)
      },
      payload: {
        To: phoneNumber.toString(),
        Body: message,
        From: TWILIO_SMS_NUMBER,
      },
    });
    return 'sent: ' + new Date();
  } catch (err) {
    return 'error: ' + err;
  }
}
