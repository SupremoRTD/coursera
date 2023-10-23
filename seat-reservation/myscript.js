;(function () {
  'use strict'

  let reservedSeats = {
    record1: { seat: 'b19', owner: { fname: 'Frank', lname: 'The Tank' } },
    record2: { seat: 'b20', owner: { fname: 'Frank', lname: 'The Tank' } },
    record3: { seat: 'b21', owner: { fname: 'Frank', lname: 'The Tank' } },
    record4: { seat: 'b22', owner: { fname: 'Frank', lname: 'The Tank' } },
  }
  let selectedSeats = []

  // Set seat reservations
  const validateSeats = () => {
    document.querySelectorAll('#seating section div:not(.label)').forEach(seat => {
      let seatReserved = false

      for (const rseat in reservedSeats) {
        if (reservedSeats.hasOwnProperty(rseat)) {
          if (reservedSeats[rseat].seat === seat.id) seatReserved = true
        }
      }

      if (seatReserved !== true) return

      seat.className = 'r'
      seat.innerHTML = 'R'
    })
  }

  // Create seats
  const generateSeats = (() => {
    const createSeats = (seatRowName, seatStartNumber, seatTotal) => {
      let seats = []

      for (let i = 0; i < seatTotal; i++) {
        const seat = document.createElement('div')
        seat.setAttribute('id', seatRowName.toLowerCase() + seatStartNumber)
        seat.className = 'a'
        seat.innerHTML = seatStartNumber
        seats.push(seat)
        seatStartNumber++
      }

      return seats
    }

    const createSection = (sectionRowName, sectionSide, sectionSeats) => {
      const row = document.getElementById(sectionSide)
      const header = document.createElement('div')
      header.className = 'label'
      header.innerHTML = sectionRowName

      switch (sectionSide) {
        case 'left':
          row.appendChild(header)
          row.append(...sectionSeats)
          break
        case 'middle':
          row.append(...sectionSeats)
          break
        case 'right':
          row.append(...sectionSeats)
          row.appendChild(header)
          break
      }
    }

    const createRows = (rows, sections) => {
      let totalSeats = 1
      rows.forEach(row => {
        for (const section in sections) {
          createSection(row, section, createSeats(row, totalSeats, sections[section]))
          totalSeats += sections[section]
        }
      })
    }

    createRows('ABCDEFGHIJKLMNOPQRST'.split(''), { left: 3, middle: 9, right: 3 })
    validateSeats()
  })()

  // Set seat selection action
  const generateSeatAction = (() => {
    document.querySelectorAll('#seating section div:not(.label):not(.r)').forEach(seat => {
      seat.addEventListener('click', function () {
        switch (this.className) {
          case 'a':
            selectedSeats.push(this.id)
            this.className = 's'
            break
          case 's':
            selectedSeats = selectedSeats.filter(seatId => seatId !== this.id)
            this.className = 'a'
            break
        }
      })
    })
  })()

  // Reservation form
  const generateFormActions = (() => {
    const form = document.getElementById('confirmres')
    const modal = document.getElementById('resform')

    const clear = () => form.reset()

    const open = () => {
      modal.style.display = 'block'
      checkValidForm()
    }

    const close = () => {
      modal.style.display = 'none'
      clear()
    }

    const checkValidForm = () => {
      const selectedseats = document.getElementById('selectedseats')

      if (selectedSeats.length === 0) {
        form.style.display = 'none'
        selectedseats.innerHTML = `
          <span style="color:red; font-weight:bold">You must select seats before you can reserve them.</span>
          <p><a href="#" id="error">cancel</a> and choose at least 1 seat to reserve</p>`
        document.getElementById('error').addEventListener('click', function (evt) {
          evt.preventDefault()
          close()
        })
      } else {
        form.style.display = 'block'
        selectedseats.innerHTML = `
          You have selected seat${selectedSeats.length > 1 ? 's' : ''} 
          <strong>${selectedSeats.join(', ').replace(/,\s(?=[^,]*$)/, ' and ')}</strong>.`
      }
    }

    const submit = () => {
      let reservationRecords = Object.keys(reservedSeats).length

      selectedSeats.forEach(seat => {
        reservationRecords++
        reservedSeats[`record${reservationRecords}`] = {
          seat: seat,
          owner: { fname: form.elements.fname.value, lname: form.elements.lname.value },
        }
      })

      selectedSeats = []
      validateSeats()
      close()
    }

    document.getElementById('reserve').addEventListener('click', function (evt) {
      evt.preventDefault()
      open()
    })

    document.getElementById('cancel').addEventListener('click', function (evt) {
      evt.preventDefault()
      close()
    })

    document.getElementById('confirmbtn').addEventListener('click', function (evt) {
      evt.preventDefault()
      submit()
    })
  })()
})()
