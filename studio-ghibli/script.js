;(function () {
  'use strict'

  const navLinks = document.querySelectorAll('#mainnav ul li a')
  const filmSortNav = document.querySelector('#filmnav')
  const filmSortElement = document.querySelector('#sortorder')
  const mainElement = document.querySelector('main')
  const loadingElement = document.querySelector('#loader')

  let url = 'https://ghibliapi.herokuapp.com/'
  let dataSet = 'films'
  let data = []
  let fetching = false

  async function addCards(array, type) {
    fetching = true
    loadingElement.style.display = 'block'
    mainElement.style.display = 'none'

    const cards = array.map(item => createCard(item, type))
    await Promise.all(cards)

    fetching = false
    loadingElement.style.display = 'none'
    mainElement.style.display = 'grid'
  }

  async function createCard(data, type) {
    const card = document.createElement('article')

    switch (type) {
      case 'films':
        card.innerHTML = createFilmCardContents(data)
        break
      case 'people':
        card.innerHTML = await createPeopleCardContents(data)
        break
      case 'locations':
        card.innerHTML = await createLocationCardContents(data)
        break
      case 'species':
        card.innerHTML = await createSpeciesCardContents(data)
        break
      case 'vehicles':
        card.innerHTML = await createVehicleCardContents(data)
    }

    mainElement.appendChild(card)
  }

  function createFilmCardContents(data) {
    const html = `
      <h2>${data.title}</h2>
      <p><strong>Director:</strong> ${data.director}</p>
      <p><strong>Year:</strong> ${data.release_date}</p>
      <p><strong>Description:</strong> ${data.description}</p>
      <p><strong>Rotten Tomatoes Score:</strong> ${data.rt_score}</p>`
    return html
  }

  async function createPeopleCardContents(data) {
    const filmPromises = data.films.map(film => getIndividualDataItem(film, 'title'))
    const filmTitles = await Promise.all(filmPromises)
    const species = await getIndividualDataItem(data.species, 'name')

    const html = `
      <h2>${data.name}</h2>
      <p><strong>Details:</strong>
        <div class="sub-details">
          <div><span>Gender:</span> ${data.gender},</div>
          <div><span>Age:</span> ${data.age},</div>
          <div><span>Eye color:</span> ${data.eye_color},</div>
          <div><span>Hair color:</span> ${data.hair_color}</div>
        </div>
      </p>
      <p><strong>Films:</strong> ${filmTitles.join(', ')}</p>
      <p><strong>Species:</strong> ${species}</p>`
    return html
  }

  async function createLocationCardContents(data) {
    const residentPromises = data.residents.map(resident => {
      return resident.match('https?://') ? getIndividualDataItem(resident, 'name') : 'NA'
    })
    const residentNames = residentPromises.length === 0 ? ['NA'] : await Promise.all(residentPromises)

    const filmPromises = data.films.map(film => getIndividualDataItem(film, 'title'))
    const filmTitles = await Promise.all(filmPromises)

    const html = `
      <h2>${data.name}</h2>
      <p><strong>Details:</strong>
        <div class="sub-details">
          <div><span>Climate:</span> ${data.climate === 'TODO' ? 'NA' : data.climate},</div>
          <div><span>Terrain:</span> ${data.terrain === 'TODO' ? 'NA' : data.terrain},</div>
          <div><span>Surface Water:</span> ${!data.surface_water ? 'NA' : `${data.surface_water}%`},</div>
        </div>
      </p>
      <p><strong>Residents:</strong> ${residentNames.join(', ')}</p>
      <p><strong>Films:</strong> ${filmTitles.join(', ')}</p>`
    return html
  }

  async function createSpeciesCardContents(data) {
    const peoplePromises = data.people.map(person => getIndividualDataItem(person, 'name'))
    const peopleNames = await Promise.all(peoplePromises)

    const filmPromises = data.films.map(film => getIndividualDataItem(film, 'title'))
    const filmTitles = await Promise.all(filmPromises)

    const html = `
      <h2>${data.name}</h2>
      <p><strong>Details:</strong>
        <div class="sub-details">
          <div><span>Classification:</span> ${data.classification},</div>
          <div><span>Hair Colors:</span> ${data.hair_colors},</div>
          <div><span>Eye Colors:</span> ${data.eye_colors}</div>
        </div>
      </p>
      <p><strong>People:</strong> ${peopleNames.join(', ')}</p>
      <p><strong>Films:</strong> ${filmTitles.join(', ')}</p>`
    return html
  }

  async function createVehicleCardContents(data) {
    const filmPromises = data.films.map(film => getIndividualDataItem(film, 'title'))
    const filmTitles = await Promise.all(filmPromises)
    const pilot = await getIndividualDataItem(data.pilot, 'name')

    const html = `
      <h2>${data.name}</h2>
      <p><em><strong>${data.description}</strong></em><p>
      <p><strong>Details:</strong>
        <div class="sub-details">
          <div><span>Length:</span> ${data.length},</div>
          <div><span>Vehicle Class:</span> ${data.vehicle_class}</div>
        </div>
      </p>
      <p><strong>Pilot:</strong> ${pilot}</p>
      <p><strong>Films:</strong> ${filmTitles.join(', ')}</p>`
    return html
  }

  function sortOrder(array) {
    const sortOrder = document.querySelector('#sortorder').value

    switch (sortOrder) {
      case 'title':
        array.sort((a, b) => (a[sortOrder] > b[sortOrder] ? 1 : -1))
        break
      case 'release_date':
      case 'rt_score':
        array.sort((a, b) => (parseInt(a[sortOrder]) < parseInt(b[sortOrder]) ? 1 : -1))
        break
    }
  }

  async function getRequestData(endpoint) {
    const promise = await fetch(`${url}${endpoint}`)

    data = []
    data = await promise.json()
  }

  async function getIndividualDataItem(url, dataName) {
    let item
    try {
      const dataPromise = await fetch(url)
      const data = await dataPromise.json()
      item = data[dataName]
    } catch (err) {
      item = 'NA'
    } finally {
      return item
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', async function (event) {
      event.preventDefault()

      if (!fetching) {
        dataSet = link.getAttribute('href').substring(1)
        await getRequestData(dataSet)

        mainElement.innerHTML = ''
        filmSortNav.style.display = 'none'

        if (dataSet === 'films') {
          filmSortNav.style.display = 'block'
          filmSortElement.removeAttribute('disabled')
          sortOrder(data)
        }

        addCards(data, dataSet)
      }
    })
  })

  filmSortElement.addEventListener('change', function () {
    mainElement.innerHTML = ''
    sortOrder(data)
    addCards(data, dataSet)
  })

  window.addEventListener('load', async function () {
    await getRequestData(dataSet)
    filmSortElement.removeAttribute('disabled')
    addCards(data, dataSet)
  })
})()
