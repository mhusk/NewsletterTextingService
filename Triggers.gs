/**
 * This is a trigger that will run Verify & Move Function which will also run the SendWelcome Message Function
 */
function NewSubmissionTrigger(){

  ScriptApp.newTrigger('OnFormSubmission')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
}

function OnFormSubmission(){
  VerifyAndMove()
  SendWelcomeMessage();
  RemoveUnsubscribedResponses();
}
