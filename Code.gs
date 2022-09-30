var telegramUrl = "https://api.telegram.org/bot" + bot_token;

function getMe() {
  var url = telegramUrl + "/getMe";
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + googleWebAppUrl;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function doGet(e) {
  // return HtmlService.createHtmlOutput("Hi there v" + currentVersion);
  if (e.parameter.newTriggerHH) {
    setNewMedicineReminderTrigger(Number(e.parameter.newTriggerHH), Number(e.parameter.newTriggerMM))
    return ContentService.createTextOutput(JSON.stringify({
      result: 'Success',
      hour: e.parameter.newTriggerHH,
      near_minute: e.parameter.newTriggerMM,
      botVersion: currentVersion,
    }))
  } else {
    return ContentService.createTextOutput(JSON.stringify({
      response: 'Hi there v' + currentVersion
    }))
  }
}

function doPost(e) {
  // this is where telegram works
  var data = JSON.parse(e.postData.contents);
  Logger.log("doPost! data = " + data);
  if (getPropertyValue('sendEmailForEachdoPost(e)') === 'true') {
    sendEmail(Session.getEffectiveUser().getEmail(), 'subject', JSON.stringify(data, null, 4));
  }
  if (data.message) {
    var text = data.message.text;
    var chat_id = data.message.chat.id;
    // checar se pe pra responder nesse grupo:
    if (answerInThisGroup(chat_id)) {
      var name = data.message.from.first_name + " " + data.message.from.last_name;
      var username = data.message.from.username;
      var user_id = data.message.from.id;
      var group_name = data.message.chat.title;
      var answer = "v" + currentVersion + " - Hi " + name + ", thank you for your comment " + "'" + text + "'";

      var mainSheet = SpreadsheetApp.openById(ssId).getSheets()[0];
      mainSheet.appendRow([new Date(), getBotName(), getBotVersion(), chat_id, group_name, username, user_id, name, text, answer]);
      setLastRowFormatLikeFirstDataRow(mainSheet);

      // after all, send a telegram message (answer)
      if (group_name) {
        var groupSheet = SpreadsheetApp.openById(ssId).getSheetByName(group_name);
        groupSheet.appendRow([new Date(), getBotName(), getBotVersion(), chat_id, group_name, username, user_id, name, text, answer]);
        setLastRowFormatLikeFirstDataRow(groupSheet);
        var emailSubject = "Message sent to bot " + getBotName() + " " + getBotVersion() + " | group_name = " + group_name;
        if (botSettings_respondeEmGrupos) {
          sendText(chat_id, answer);
        }
      } else {
        var emailSubject = "Message sent to bot " + getBotName() + " " + getBotVersion() + " | private chat";
        sendText(chat_id, answer);
      }

      if (group_name) {
        if (botSettings_sendEmailGroupMessages) {
          GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), emailSubject, JSON.stringify(data, null, 4));
        }
      } else {
        if (botSettings_sendEmailPrivateMessages) {
          GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), emailSubject, JSON.stringify(data, null, 4));
        }
      }

    }
  } if (data.send_message) {
    let response = sendText('BOT_OWNER_ID', '\ne = ' + JSON.stringify(e));
    return ContentService.createTextOutput(JSON.stringify({
      result: 'Success',
      hour: e.parameter.newTriggerHH,
      near_minute: e.parameter.newTriggerMM,
      botVersion: currentVersion,
      response: response
    }))
    // outro tipo de mensagem
  }
}


function answerInThisGroup(chat_id) {
  var groupOfChat_IDsNotToAnswer = "CHAT_ID_NOT_TO_ANSWER"
  if (groupOfChat_IDsNotToAnswer.indexOf(chat_id) == -1) {
    Logger.log("true");
    return true;
  } else {
    Logger.log("false");
    return false;
  }
}

function sendText(chat_id, text, reply_markup) {
  // function sendTextWithinPayload(chat_id,text){
  // var url = telegramUrl + "/sendMessage?chat_id=" + chat_id + "&parse_mode=html&text="+ encodeURIComponent(text);
  var url = telegramUrl + "/sendMessage"; // NEW METHOD! payload http
  Logger.log(url);
  // var payLoadData = {'chat_id' : chat_id,'parse_mode': 'html','text': encodeURIComponent(text)}
  if (reply_markup) {
    var payLoadData = { 'chat_id': chat_id, 'parse_mode': 'html', 'text': text, 'reply_markup': reply_markup };
  } else {
    var payLoadData = { 'chat_id': chat_id, 'parse_mode': 'html', 'text': text };
  }
  Logger.log('payLoadData = %s', payLoadData);
  var params = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payLoadData),
    'muteHttpExceptions': true
  }
  var response = UrlFetchApp.fetch(url, params)
  Logger.log('sendTextWithinPayload(chat_id,text) = %s', response.getContentText());
  return response.getContentText();
}


function criaInLineKeyboardWithCallbacks_1column_New(texts, callbacks) {
  Logger.log('callbacks = %s', callbacks);
  var retorno = { 'inline_keyboard': [] };
  for (var i = 0; i < texts.length; i++) {
    //    if (i % 2 == 0){
    retorno.inline_keyboard.push([{ 'text': texts[i], 'callback_data': callbacks[i] }]);
    //      } else {
    //      retorno.inline_keyboard[Math.floor(i/2)].push({'text':texts[i],'callback_data':callbacks[i]});
    //    }
    Logger.log('texts[%s] = %s', i, texts[i]);
    Logger.log('callbacks[%s] = %s', i, callbacks[i]);
  }
  return retorno;
}


function answerCallbackQuery(callback_query_id, text, show_alert_Bol, cache_time_Seg) {
  var url = telegramUrl + "/answerCallbackQuery?callback_query_id=" + callback_query_id + "&text=" + encodeURIComponent(text) + "&show_alert=" + show_alert_Bol + "&cache_time=" + cache_time_Seg;
  Logger.log(url);
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
  return response.getContentText();
}


function editMessageText(chat_id, message_id, text, reply_markup) {
  var url = telegramUrl + "/editMessageText";
  Logger.log(url);
  if (reply_markup) {
    var payLoadData = { 'chat_id': chat_id, 'message_id': message_id, 'parse_mode': 'html', 'text': text, 'reply_markup': reply_markup };
  } else {
    var payLoadData = { 'chat_id': chat_id, 'message_id': message_id, 'parse_mode': 'html', 'text': text };
  }
  Logger.log('payLoadData = %s', payLoadData);
  var params = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payLoadData),
    'muteHttpExceptions': true
  }
  var response = UrlFetchApp.fetch(url, params)
  Logger.log(response.getContentText());
  return response.getContentText();

}


function getBotName() {
  var retorno = "error";
  if (bot_token.indexOf("BOT_TOKEN_ONLY_NUMBER_PIECE") !== -1) {
    retorno = "BOT_NAME";
  }
  Logger.log(retorno);
  return retorno
}


function getBotVersion() {
  return "v" + currentVersion;
}

function setLastRowFormatLikeFirstDataRow(sheet) {
  var firstDataRowRange = sheet.getRange("A4:M4");
  var lastRow = sheet.getLastRow();
  var lastDataRowRange = sheet.getRange("A" + lastRow + ":M" + lastRow);
  firstDataRowRange.copyTo(lastDataRowRange, { contentsOnly: false, formatOnly: true }); // copies only format
}
