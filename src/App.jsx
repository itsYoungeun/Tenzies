import { useState, useRef, useEffect } from "react"
import Die from "./components/Die"
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {
  const [dice, setDice] = useState(() => generateAllNewDice())
  const buttonRef = useRef(null)
  const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)

  // Focus the New Game button when the game is won, better for keyboard users
  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus()
    }
  }, [gameWon])

  // Generate 10 new dice with random values
  function generateAllNewDice() {
    return new Array(10)
      .fill(0)
      .map(() => ({
        value: Math.ceil(Math.random() * 6), 
        isHeld: false,
        id: nanoid(),
      }))
  }

  // Roll all dice that are not held
  function rollDice() {
    setDice(oldDice => oldDice.map(die =>
      die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
    ))

    if (gameWon) {
      setDice(generateAllNewDice())
    }
  }

  // Toggle whether a die is held
  function hold(id) {
    setDice(oldDice => oldDice.map(die => 
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      ))
  }

  // Create a Die component for each die object
  const diceElements = dice.map(dieObject => (
    <Die 
      key={dieObject.id} 
      value={dieObject.value} 
      isHeld={dieObject.isHeld} 
      hold={() => hold(dieObject.id)}
    />
  ))

  return (
    <main>
      {gameWon && <Confetti className="m-auto mt-0 h-screen w-screen"/>}
      <div aria-live="polite" className="sr-only">
        {gameWon && <p>Congratulations, you won! Press New Game to start again.</p>}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        {gameWon ? "Congratulations, you won!" : "Click each die to hold its value. Match all 10 to win."}
      </p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button 
        ref={buttonRef}
        className="roll-dice"
        onClick={rollDice}
      >
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  )
}

export default App