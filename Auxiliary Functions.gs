function sendEmail(emailRecipient, subject, emailBody, emailCC) {
  // https://developers.google.com/apps-script/reference/mail/mail-app
  // sendEmail(recipient, subject, body, options)
  // Sends an email message with optional arguments.
  var recipient = Session.getEffectiveUser().getEmail()
  // var recipient = 'email@gmail.com'
  // var subject = 'email example'
  var body = 'Available email quota: ' + availableGASemailQuota() + '\nE-mail body:\n' + emailBody
  // emailBody = emailBody.replace('\n','<br>')
  var emailCC = (emailCC) ? (emailCC) : ('email@gmail.com')
  // Send an email with two attachments: a file from Google Drive (as a PDF) and an HTML file.
  MailApp.sendEmail(recipient, subject, body, {
    name: getBotName() + ' ' + getBotVersion() + ' - Auto Emailer Script',
    // cc: emailCC,
    // htmlBody: '</b>Available email quota: '+availableGASemailQuota()+'\n<br>E-mail body:</b><br>\n'+emailBody,
  });
}


function availableGASemailQuota() {
  var retorno = MailApp.getRemainingDailyQuota();
  Logger.log('MailApp.getRemainingDailyQuota() = %s', retorno);
  return retorno;
}
