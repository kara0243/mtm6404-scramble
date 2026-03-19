/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const words= ["sunrise", "coffee", "mug", "aroma", "steam", "breakfast", "cozy", "kettle", "roast",
  "bean", "warmth", "caffeine", "toast", "dawn", "routine"]


const MAX_STRIKES = 3
const MAX_PASSES = 3

function Game() {
  const [gameState, setGameState] = React.useState(() => {
    const saved = localStorage.getItem("scrambleGameState")
    const initialState = saved ? JSON.parse(saved) : {
      currentWordIndex: 0,
      points: 0,
      strikes: 0,
      passes: MAX_PASSES,
      gameOver: false,
      words: shuffle(words),
      message: "",
      currentScramble: "" 
    }

    if (!initialState.currentScramble) {
      const word = initialState.words[initialState.currentWordIndex].toUpperCase().replace(/\s+/g, '')
      initialState.currentScramble = shuffle(word)
    }
    return initialState
  })

  const [guess, setGuess] = React.useState("")

  React.useEffect (() => {
    localStorage.setItem('scrambleGameState', JSON.stringify(gameState))
  }, [gameState])

  const currentWord = gameState.words[gameState.currentWordIndex].toUpperCase().replace(/\s+/g, '')

  const handleGuess = (e) => {
    e.preventDefault()
    const userGuess = guess.toUpperCase().replace(/\s+/g, '')

    if (userGuess === currentWord) {
      const newIndex = gameState.currentWordIndex + 1
      const isGameComplete = newIndex >= gameState.words.length

      const nextWord = !isGameComplete ? gameState.words[newIndex].toUpperCase().replace(/\s+/g, '') : ''
      setGameState(prev => ({
        ...prev,
        points: prev.points + 1,
        currentWordIndex: newIndex,
        gameOver: isGameComplete,
        message: isGameComplete ? 'Great job! You finished the morning scramble!' : 'Correct!',
        currentScramble: isGameComplete ? '' : shuffle(nextWord)
      }))
    } else {
      const newStrikes = gameState.strikes + 1
      setGameState(prev => ({
        ...prev,
        strikes: newStrikes,
        gameOver: newStrikes >= MAX_STRIKES,
        message: newStrikes >= MAX_STRIKES ? 'Game Over! Too many strikes!' : 'Not quite, try again!'
      }))
    }
    setGuess('')
  }

  const handlePass = () => {
    if (gameState.passes > 0) {
      const newIndex = gameState.currentWordIndex + 1
      const isGameComplete = newIndex >= gameState.words.length

      const nextWord = !isGameComplete ? gameState.words[newIndex].toUpperCase().replace(/\s+/g, '') : ''
      setGameState(prev => ({
        ...prev,
        passes: prev.passes - 1,
        currentWordIndex: newIndex,
        gameOver: isGameComplete,
        message: isGameComplete ? 'Morning challenge completed!' : 'Word skipped!',
        currentScramble: isGameComplete ? '' : shuffle(nextWord)
      }))
    }
  }

  const resetGame = () => {
    const shuffledWords = shuffle(words)
    setGameState({
      currentWordIndex: 0,
      points: 0,
      strikes: 0,
      passes: MAX_PASSES,
      gameOver: false,
      words: shuffledWords,
      message: '',
      currentScramble: shuffle(shuffledWords[0].toUpperCase().replace(/\s+/g, ''))
    })
    setGuess('')
  }

  if (gameState.gameOver) {
    return (
      <div className="game-container">
        <h1>Morning Word Scramble</h1>
        <p>Final Score: {gameState.points}</p>
        <button onClick={resetGame}>Play Again</button>
      </div>
    )
  }

  return (
    <div className="game-container">
      <h1>Coffee & Morning Scramble</h1>
      <div className="stats">
        <p>Points: {gameState.points}</p>
        <p>Strikes: {gameState.strikes}/{MAX_STRIKES}</p>
        <p>Passes: {gameState.passes}</p>
      </div>
      <div className="word">
        <h2>{gameState.currentScramble}</h2>
      </div>
      <form onSubmit={handleGuess}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value.toUpperCase().replace(/\s+/g, ''))}
          placeholder="ENTER YOUR GUESS"
        />
        <button type="submit">Guess</button>
        <button type="button" onClick={handlePass} disabled={gameState.passes === 0}>
          Pass ({gameState.passes} left)
        </button>
      </form>
      {gameState.message && <p className="message">{gameState.message}</p>}
    </div>
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Game />)

