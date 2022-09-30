function notificaRemedioMaeDiario() {
  var now = new Date();
  var weekDay = now.getDay();
  var weekDays = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"]
  var answer = "Já tomou hoje?\n\nHoje é " + weekDays[weekDay] + ", dia de: ";
  if (weekDay == 2 || weekDay == 4 || weekDay == 6) {
    answer += "<b>3mg</b>";
  } else {
    answer += "<b>6mg</b>";
  }
  var buttonsText = [];
  var cbDatas = [];
  buttonsText.push("sim")
  cbDatas.push("sim")
  var reply_markup = JSON.stringify(criaInLineKeyboardWithCallbacks_1column_New(buttonsText, cbDatas))

  var response = sendText(GROUP_ID, answer, reply_markup);
}

const setNewMedicineReminderTrigger = (startTime_hh, startTime_mm) => { // setNewMedicineReminderTrigger(18, 00) near minute = estimated;
  // console.log(`ScriptApp.getProjectTriggers = ${JSON.stringify(ScriptApp.getProjectTriggers())}`);
  // console.log(`ScriptApp.getUserTriggers = ${JSON.stringify(ScriptApp.getUserTriggers())}`);
  // console.log(`ScriptApp.getScriptTriggers = ${JSON.stringify(ScriptApp.getScriptTriggers())}`);
  Logger.log('Triggers list --- START')
  let triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    console.log(`triggers[${i}] 
    id = ${triggers[i].getUniqueId()} = ${triggers[i].getHandlerFunction()}
    source = ${triggers[i].getTriggerSource()}`) // logs "myFunction"
    if (triggers[i].getHandlerFunction() === 'notificaRemedioMaeDiario') {
      ScriptApp.deleteTrigger(triggers[i])
      console.log('trigger deleted');
    }
  }
  Logger.log('Triggers list --- END')
  Logger.log(`Creating new Trigger with time = ${startTime_hh}:${startTime_mm}`)
  // STACKOVERFLOW https://developers.google.com/apps-script/reference/script/clock-trigger-builder#nearMinute(Integer)
  // Runs at approximately 17:30 in the timezone of the script
  ScriptApp.newTrigger("notificaRemedioMaeDiario")
    .timeBased()
    .atHour(startTime_hh)
    .nearMinute(startTime_mm)
    .everyDays(1) // Frequency is required if you are using atHour() or nearMinute()
    .create();
  Logger.log(`New Trigger created`)
};




