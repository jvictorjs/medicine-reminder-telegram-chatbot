function setaProperties() {
  console.log('typeof(new Date()) = ' + typeof (new Date()))
  setUserPropertie('sendEmailForEachdoPost(e)', false)
  // setUserPropertie('testMode', false)
}

function deletaPropertie() {
  var userProperties = PropertiesService.getUserProperties();
  console.log(userProperties.getProperties());
  userProperties.deleteProperty("timeToLoop");
  console.log(userProperties.getProperties());
}


function getPropertyValue(propertieName) {
  return PropertiesService.getUserProperties().getProperty(propertieName);
}

function logaProperties() {
  console.log('User Properties = %s', JSON.stringify(PropertiesService.getUserProperties().getProperties()));
}

function setUserPropertie(propertieName, propertieValue) {
  var userProperties = PropertiesService.getUserProperties()
  console.log(userProperties.getProperties());
  PropertiesService.getUserProperties().setProperty(propertieName, propertieValue);
  console.log(userProperties.getProperties());
}
