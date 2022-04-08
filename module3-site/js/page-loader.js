;(async function () {
  'use strict'

  const urlBase = location.href.substring(0, location.href.lastIndexOf('/') + 1)

  const templateFiles = document.querySelectorAll('[data-template-file]')
  const templateVars = document.querySelectorAll('[data-template-var]')

  const dataPromise = await fetch(`${urlBase}data.json`)
  const dataSet = await dataPromise.json()

  // fill templates files
  templateFiles.forEach(async file => {
    const elementLoc = await fetch(`${urlBase}${file.dataset.templateDir}/${file.dataset.templateFile}.html`)
    const elementDOM = await elementLoc.text()
    file.innerHTML = elementDOM
  })

  // fill template vars
  templateVars.forEach(data => {
    if (!dataSet.hasOwnProperty(data.dataset.templateVar)) return
    data.innerHTML = dataSet[data.dataset.templateVar]
  })
})()
