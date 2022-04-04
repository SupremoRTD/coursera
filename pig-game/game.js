;(function () {
  let startGame = document.getElementById('startgame')
  let gameControl = document.getElementById('gamecontrol')
  let game = document.getElementById('game')
  let score = document.getElementById('score')
  let actionArea = document.getElementById('actions')
  let gameData = {
    dice: ['1die.png', '2die.png', '3die.png', '4die.png', '5die.png', '6die.png'],
    players: ['PLAYER 1', 'PLAYER 2'],
    score: [0, 0],
    roll1: 0,
    roll2: 0,
    rollAccum: 0,
    rollSum: 0,
    index: 0,
    gameEnd: 99,
  }
  const turnDelay = 3000

  startGame.addEventListener('click', function () {
    gameControl.innerHTML = `
        <h2>THE PIG HAS AWAKENED<h2>
        <button id="quit">FORFEIT YOUR LIFE TO THE PIG?</button>`
    document.getElementById('quit').addEventListener('click', function () {
      window.location.reload()
    })
    gameData.index = Math.round(Math.random())
    setupTurn()
  })

  function setupTurn() {
    actionArea.style.color = 'var(--color3)'
    game.style.display = 'block'
    game.innerHTML = `<p><b>${gameData.players[gameData.index]}</b>, WHAT DO YOU OFFER?</p>`
    actionArea.innerHTML = '<button id="role">OFFER</button>'
    document.getElementById('role').addEventListener('click', throwDice)
  }

  function swapPlayer(swapCondition) {
    let output = {
      snakeEyes: '<p><strong>PIG EYES. THE PIG GOD STRIPS YOU OF YOUR SCORE.</p>',
      oneRolled: '<p>A SINGLE GLUTTONOUS ACT FORFEITS YOUR TURN.</p>',
      passTurn: false,
    }

    gameData.index ? (gameData.index = 0) : (gameData.index = 1)
    output[swapCondition] ? (game.innerHTML += output[swapCondition]) : false
    actionArea.style.color = 'var(--color2)'
    actionArea.innerHTML = `<p><b>${gameData.players[gameData.index]}, THE PIG SUMMONS YOU.</b></p>`
    setTimeout(setupTurn, turnDelay)
  }

  function throwDice() {
    actionArea.innerHTML = ''
    d1rotate = Math.floor(Math.random() * 360) + 1
    d2rotate = Math.floor(Math.random() * 360) + 1
    gameData.roll1 = Math.floor(Math.random() * 6) + 1
    gameData.roll2 = Math.floor(Math.random() * 6) + 1
    gameData.rollSum = gameData.roll1 + gameData.roll2
    gameData.rollAccum += gameData.rollSum
    game.innerHTML = `
      <p><b>${gameData.players[gameData.index]}'S</b> OFFERINGS:</p>
      <div id="dice-container">
        <div>
          <img 
            src="images/${gameData.dice[gameData.roll1 - 1]}" 
            alt="${gameData.dice[gameData.roll1 - 1]}" 
            style="transform: rotate(${d1rotate}deg)" />
        </div>
        <div>
          <img 
            src="images/${gameData.dice[gameData.roll2 - 1]}" 
            alt="${gameData.dice[gameData.roll2 - 1]}" 
            style="transform: rotate(${d2rotate}deg)" />
        </div>
      </div>`

    if (gameData.rollSum === 2) {
      gameData.score[gameData.index] = 0
      gameData.rollAccum = 0
      swapPlayer('snakeEyes')
      checkForWin() // this is used to update the score to zero
    } else if (gameData.roll1 === 1 || gameData.roll2 === 1) {
      gameData.rollAccum = 0
      swapPlayer('oneRolled')
    } else {
      game.innerHTML += `
        <p>YOU HAVE PROCURED <strong>${gameData.rollSum}</strong> OFFERINGS</p>
        <p>THERE ARE <strong>${gameData.rollAccum}</strong> OFFERINGS READY FOR THE PIG </p>`
      actionArea.innerHTML = `
        <button id="rollagain">PROCURE MORE</button> or 
        <button id="pass">FINISH TRIBUTE</button> ?`

      checkForWin() // will update to win if players score is > winning amount

      document.getElementById('rollagain').addEventListener('click', throwDice)
      document.getElementById('pass').addEventListener('click', () => {
        gameData.score[gameData.index] += gameData.rollAccum
        gameData.rollAccum = 0
        return !checkForWin() ? swapPlayer('passTurn') : checkForWin()
      })
    }
  }

  function checkForWin() {
    const currentScore = gameData.score[gameData.index]
    const currentPlayer = gameData.players[gameData.index]

    if (currentScore > gameData.gameEnd) {
      score.innerHTML = `<h2>${currentPlayer} HAS PLEASE THE PIG WITH ${currentScore} OFFERINGS!</h2>`
      actionArea.innerHTML = ''
      document.getElementById('quit').innerHTML = 'BEGIN TRIBUTE ONCE MORE?'
      return true
    } else {
      score.innerHTML = `
        <p>
          <span>PLAYER 1 TOTAL OFFERINGS: <b>${gameData.score[0]}</b></span> 
          <span>PLAYER 2 TOTAL OFFERINGS: <b>${gameData.score[1]}</b></span>
        </p>`
      return false
    }
  }
})()
