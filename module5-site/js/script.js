$(function () {
  $('#navbarToggle').blur(function (event) {
    const screenWidth = window.innerWidth
    if (screenWidth < 768) {
      $('#collapsable-nav').collapse('hide')
    }
  })
})
;(function ($window) {
  const DC = {}
  const HOME_HTML = 'snippets/home-snippet.html'

  const insertHtml = function (selector, html) {
    const targetElem = document.querySelector(selector)
    targetElem.innerHTML = html
  }

  const showLoading = function (selector) {
    let html = '<div class="text-center">'
    html += '<img src="images/ajax-loader.gif"></div>'
    insertHtml(selector, html)
  }

  document.addEventListener('DOMContentLoaded', function (event) {
    showLoading('#main-content')
    $ajaxUtils.sendGetRequest(
      HOME_HTML,
      function (res) {
        document.querySelector('#main-content').innerHTML = res
      },
      false
    )
  })
})(window)
