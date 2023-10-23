;(function () {
  'use strict'

  // Smooth Scroll
  function navScroller() {
    const logoLink = $('header > div')
    const navLinks = $('header nav ul li a')
    const sections = $('#page > section')
    const bodyOffset = parseInt($('body').css('padding-top')) === 0 ? 120 : parseInt($('body').css('padding-top')) + 20

    let sectionTops = []
    let pageTop
    let counter = 0
    let prevCounter = 0
    let doneResizing

    function animateScroll(distance, duration, callback) {
      $('html, body')
        .stop()
        .animate({ scrollTop: distance }, duration, 'easeOutCirc', function () {
          typeof callback == 'function' && callback()
        })
    }

    function resetPagePosition() {
      // recalculate section tops
      sectionTops = []
      sections.each(function () {
        sectionTops.push(Math.round($(this).offset().top))
      })

      // determine which sections have passed
      let pagePosition = $(window).scrollTop() + bodyOffset
      counter = 0
      for (let i = 0; i < sectionTops.length; i++) {
        if (pagePosition > sectionTops[i]) counter++
      }
      counter--

      // highlight correct nav link based on which section is showing
      if (counter === -1) {
        navLinks.removeAttr('class')
      } else {
        navLinks.removeAttr('class').eq(counter).addClass('header-nav-selected')
      }
    }
    resetPagePosition()

    // scroll to top on logo click
    logoLink.click(function () {
      animateScroll(0, 600, resetPagePosition)
    })

    // scroll to section on nav click
    navLinks.click(function (e) {
      e.preventDefault()
      const section = $(this).attr('href')
      animateScroll($(section).offset().top - bodyOffset, 600, function () {
        navLinks.each(function () {
          $(this).removeAttr('class')
          if ($(this).attr('href') === section) $(this).addClass('header-nav-selected')
        })
      })
      return false
    })

    // highlight nav on scroll
    $(window).scroll(function () {
      let offsetVal = bodyOffset + 20
      pageTop = $(window).scrollTop() + offsetVal

      // calculate which section has passed
      if (pageTop > sectionTops[counter + 1]) {
        counter++
      } else if (counter > 0 && pageTop < sectionTops[counter]) {
        counter--
      }

      // removes the nav highlight when in the slider area
      if ($(window).scrollTop() < sectionTops[0] - offsetVal) {
        resetPagePosition()
      }

      // add nav highlight
      if (counter !== prevCounter) {
        if (counter > -1) $(navLinks).removeAttr('class').eq(counter).addClass('header-nav-selected')
        prevCounter = counter
      }
    })

    $(window).on('resize', function () {
      clearTimeout(doneResizing)
      doneResizing = setTimeout(function () {
        resetPagePosition()
      }, 500)
    })
  }

  // Flexslider
  function imageSlider() {
    $('.flexslider').flexslider({
      animation: 'slide',
      slideshowSpeed: 4000,
      pauseOnHover: true,
      directionNav: false,
      before: function () {
        $('.cta').css('bottom', '-225px')
      },
      start: function () {
        navScroller()
        $('.cta').animate({ bottom: '0' }, 600, 'easeInCirc')
      },
      after: function () {
        $('.cta').animate({ bottom: '0' }, 600, 'easeInCirc')
      },
    })
  }

  // Tabs
  function loadTabs() {
    $('#tabs > ul > li > a').click(function (e) {
      e.preventDefault()
      $('#tabs > ul > li > a').css({ background: 'var(--tea-green)', color: 'var(--rich-black)' })
      $(this).css({ background: 'var(--tea-green-light)', color: 'var(--rich-black)' })

      const contentID = $(this).attr('href')

      $('#tabs > div:visible > div').fadeOut(250, function () {
        $('#tabs > div:visible').css('display', 'none')
        $(`${contentID}`).css('display', 'block')
        $(`${contentID} > div`).css('display', 'none').fadeIn(350)
      })
    })
  }

  // Content Rotator
  function contentRotator(counter = 1) {
    const bq = $(`#rotator blockquote:nth-child(${counter})`)

    bq.fadeIn(2000, function () {
      setTimeout(function () {
        bq.fadeOut(1500, function () {
          counter = counter === $('#rotator blockquote').length ? 1 : counter + 1
          contentRotator(counter)
        })
      }, 4000)
    })
  }

  // Features Rotator
  function featuresRotator() {
    // set initial feature color
    $('.eachfeature li').first().addClass('featureHighlighted')

    const rotateFeatures = setInterval(function () {
      const firstFeature = $('.eachfeature li').first()
      const featureHeight = firstFeature.css('height')

      // clone first feature and set to end of list
      firstFeature.clone().appendTo($('.eachfeature'))

      // reset clone's style to normal
      $('.eachfeature li').last().removeAttr('class')

      // animate feature upward movement, then set styles
      $('.eachfeature li')
        .css('position', 'relative')
        .animate({ top: `-${featureHeight}` }, 600, 'easeInCirc', function () {
          firstFeature.remove()
          // grab new feature dom and set color and positions
          $('.eachfeature li').first().addClass('featureHighlighted')
          $('.eachfeature li').removeAttr('style')
        })
    }, 2500)
  }

  // load scripts
  $(window).on('load', function () {
    imageSlider()
    loadTabs()
    contentRotator()
    featuresRotator()
  })
})()
