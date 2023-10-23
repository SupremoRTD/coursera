;(function ($window) {
  const ajaxUtils = {}

  function getRequestObject() {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest()
    } else {
      $window.alert('Ajax is not supported!')
      return null
    }
  }

  ajaxUtils.sendGetRequest = function (requestUrl, responseHandler, isJsonResponse) {
    const request = getRequestObject()
    request.onreadystatechange = function () {
      handleResponse(request, responseHandler, isJsonResponse)
    }
    request.open('GET', requestUrl, true)
    request.send(null) // for POST only
  }

  function handleResponse(request, responseHandler, isJsonResponse) {
    if (request.readyState == 4 && request.status == 200) {
      // Default to isJsonResponse = true
      if (isJsonResponse == undefined) {
        isJsonResponse = true
      }

      if (isJsonResponse) {
        responseHandler(JSON.parse(request.responseText))
      } else {
        responseHandler(request.responseText)
      }
    }
  }

  $window.$ajaxUtils = ajaxUtils
})(window)
