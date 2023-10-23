// Generic
$(() => {
  // collapse navbar when hamburger loses focus
  $('#navbarToggle').blur(function (event) {
    if (window.innerWidth < 768) {
      $('#collapsable-nav').collapse('hide')
    }
  })

  // active link handler
  const navLinks = document.querySelectorAll('#nav-list li a')
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      //remove active class
      for (link of navLinks) link.parentNode.classList.remove('active')
      // set active class
      this.parentNode.classList.add('active')
    })
  })
})

  // External Request Handlers
  ; ($window => {
    const DC = {}

    // home page snippet
    const HOME_HTML = 'snippets/home-snippet.html'

    // menu categories
    const ALL_CATEGORIES_URL = 'https://coursera-jhu-default-rtdb.firebaseio.com/categories.json'
    const CATEGORIES_TITLE_HTML = 'snippets/categories-title-snippet.html'
    const CATEGORY_HTML = 'snippets/category-snippet.html'

    // menu items
    const MENU_ITEMS_URL = 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items'
    const MENU_ITEMS_TITLE_HTML = 'snippets/menu-items-title.html'
    const MENU_ITEMS_HTML = 'snippets/menu-item.html'

    // loads html snippets to dom
    const insertHtml = (selector, html) => (document.querySelector(selector).innerHTML = html)

    // displays loading icon
    const showLoading = selector => {
      const HTML = `
      <div class="text-center">
        <img src="images/ajax-loader.gif">
      </div>`
      insertHtml(selector, HTML)
    }

    // replaces moustachioed tags with their value
    const insertProperty = (string, propName, propValue) => {
      return string.replace(new RegExp(`{{${propName}}}`, 'g'), propValue)
    }

    // queries menu category data, builds results and updates dom
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

    // menu category builder function
    const buildCategoriesViewHTML = (categories, categoriesTitleHTML, categoryHTML) => {
      let finalHTML = categoriesTitleHTML
      finalHTML += '<section class="row">'

      for (let i = 0; i < categories.length; i++) {
        const name = categories[i].name
        const shortName = categories[i].short_name
        let html = categoryHTML
        html = insertProperty(html, 'name', name)
        html = insertProperty(html, 'short_name', shortName)
        finalHTML += html
      }

      finalHTML += '</section>'
      return finalHTML
    }

    // queries menu item data, builds results and updates dom
    const buildAndShowMenuItemsHTML = categoryMenuItems => {
      $ajaxUtils.sendGetRequest(
        MENU_ITEMS_TITLE_HTML,
        menuItemsTitleHTML => {
          $ajaxUtils.sendGetRequest(
            MENU_ITEMS_HTML,
            menuItemsHTML => {
              insertHtml('#main-content', buildMenuItemsViewHTML(categoryMenuItems, menuItemsTitleHTML, menuItemsHTML))
            },
            false
          )
        },
        false
      )
    }

    // menu item builder function
    const buildMenuItemsViewHTML = (categoryMenuItems, menuItemsTitleHTML, menuItemHTML) => {
      // generate dynamic title
      menuItemsTitleHTML = insertProperty(menuItemsTitleHTML, 'name', categoryMenuItems.category.name)
      menuItemsTitleHTML = insertProperty(
        menuItemsTitleHTML,
        'special_instructions',
        categoryMenuItems.category.special_instructions
      )

      // generate content
      let finalHTML = menuItemsTitleHTML
      finalHTML += '<section class="row">'

      const menuItems = categoryMenuItems.menu_items
      const catShortName = categoryMenuItems.category.short_name
      for (let i = 0; i < menuItems.length; i++) {
        const itemPriceSmall = !menuItems[i].price_small ? '' : `$${menuItems[i].price_small.toFixed(2)}`
        const itemPriceLarge = !menuItems[i].price_large ? '' : `$${menuItems[i].price_large.toFixed(2)}`
        const smallPortionName = !menuItems[i].small_portion_name ? '' : `(${menuItems[i].small_portion_name})`
        const largePortionName = !menuItems[i].large_portion_name ? '' : `(${menuItems[i].large_portion_name})`

        let html = menuItemHTML
        html = insertProperty(html, 'short_name', menuItems[i].short_name)
        html = insertProperty(html, 'catShortName', catShortName)
        html = insertProperty(html, 'price_small', itemPriceSmall)
        html = insertProperty(html, 'small_portion_name', smallPortionName)
        html = insertProperty(html, 'price_large', itemPriceLarge)
        html = insertProperty(html, 'large_portion_name', largePortionName)
        html = insertProperty(html, 'name', menuItems[i].name)
        html = insertProperty(html, 'description', menuItems[i].description)

        if (i % 2 != 0) html += `</section><section class="row">`
        finalHTML += html
      }

      finalHTML += '</section>'
      return finalHTML
    }

    // loads main page content
    document.addEventListener('DOMContentLoaded', () => {
      showLoading('#main-content')
      $ajaxUtils.sendGetRequest(HOME_HTML, res => (document.querySelector('#main-content').innerHTML = res), false)
    })

    // requests menu categories data from onclick events
    DC.loadMenuCategories = () => {
      showLoading('#main-content')
      $ajaxUtils.sendGetRequest(ALL_CATEGORIES_URL, buildAndShowCategoriesHTML)
    }

    // requests menu item data from onclick events
    DC.loadMenuItems = categoryShortName => {
      showLoading('#main-content')
      $ajaxUtils.sendGetRequest(`${MENU_ITEMS_URL}/${categoryShortName}.json`, buildAndShowMenuItemsHTML)
    }

    $window.$dc = DC
  })(window)
