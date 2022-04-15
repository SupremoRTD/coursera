$(() => {
  $('#navbarToggle').blur(function (event) {
    if (window.innerWidth < 768) {
      $('#collapsable-nav').collapse('hide')
    }
  })
})
;($window => {
  const DC = {}
  const HOME_HTML = 'snippets/home-snippet.html'
  const ALL_CATEGORIES_URL = 'https://davids-restaurant.herokuapp.com/categories.json'
  const CATEGORIES_TITLE_HTML = 'snippets/categories-title-snippet.html'
  const CATEGORY_HTML = 'snippets/category-snippet.html'

  const insertHtml = (selector, html) => (document.querySelector(selector).innerHTML = html)

  const showLoading = selector => {
    const HTML = `
      <div class="text-center">
        <img src="images/ajax-loader.gif">
      </div>`
    insertHtml(selector, HTML)
  }

  const insertProperty = (string, propName, propValue) => {
    return string.replace(new RegExp(`{{${propName}}}`, 'g'), propValue)
  }

  const buildAndShowCategoriesHTML = categories => {
    $ajaxUtils.sendGetRequest(
      CATEGORIES_TITLE_HTML,
      categoriesTitleHTML => {
        $ajaxUtils.sendGetRequest(
          CATEGORY_HTML,
          categoryHTML =>
            insertHtml('#main-content', buildCategoriesViewHTML(categories, categoriesTitleHTML, categoryHTML)),
          false
        )
      },
      false
    )
  }

  const buildCategoriesViewHTML = (categories, categoriesTitleHTML, categoryHTML) => {
    let finalHTML = categoriesTitleHTML
    finalHTML += '<section class="row">'

    for (let i = 0; i < categories.length; i++) {
      const NAME = categories[i].name
      const SHORT_NAME = categories[i].short_name
      let html = categoryHTML
      html = insertProperty(html, 'name', NAME)
      html = insertProperty(html, 'short_name', SHORT_NAME)
      finalHTML += html
    }

    finalHTML += '</section>'
    return finalHTML
  }

  document.addEventListener('DOMContentLoaded', () => {
    showLoading('#main-content')
    $ajaxUtils.sendGetRequest(HOME_HTML, res => (document.querySelector('#main-content').innerHTML = res), false)
  })

  DC.loadMenuCategories = () => {
    showLoading('#main-content')
    $ajaxUtils.sendGetRequest(ALL_CATEGORIES_URL, buildAndShowCategoriesHTML)
  }

  $window.$dc = DC
})(window)
