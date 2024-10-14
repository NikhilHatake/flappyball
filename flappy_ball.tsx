'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"

export default function FlappyBirdLike() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [birdPosition, setBirdPosition] = useState(50)
  const [obstacleHeight, setObstacleHeight] = useState(150)
  const [obstacleLeft, setObstacleLeft] = useState(400)

  const jumpBird = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true)
    }
    setBirdPosition(position => Math.max(0, position - 50))
  }, [gameStarted])

  useEffect(() => {
    let fallInterval: NodeJS.Timeout
    let obstacleInterval: NodeJS.Timeout

    if (gameStarted && !gameOver) {
      fallInterval = setInterval(() => {
        setBirdPosition(position => {
          if (position >= 380) {
            clearInterval(fallInterval)
            setGameOver(true)
            return 380
          }
          return position + 5
        })
      }, 50)

      obstacleInterval = setInterval(() => {
        setObstacleLeft(left => {
          if (left <= -60) {
            setScore(s => s + 1)
            setObstacleHeight(Math.random() * 200 + 50)
            return 400
          }
          return left - 5
        })
      }, 50)
    }

    return () => {
      clearInterval(fallInterval)
      clearInterval(obstacleInterval)
    }
  }, [gameStarted, gameOver])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        jumpBird()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [jumpBird])

  useEffect(() => {
    const checkCollision = () => {
      const birdTop = birdPosition
      const birdBottom = birdPosition + 20
      const obstacleTop = obstacleHeight
      const obstacleBottom = obstacleHeight + 100

      if (
        obstacleLeft < 60 && obstacleLeft > 0 &&
        (birdTop < obstacleTop || birdBottom > obstacleBottom)
      ) {
        setGameOver(true)
      }
    }

    if (gameStarted && !gameOver) {
      const collisionInterval = setInterval(checkCollision, 50)
      return () => clearInterval(collisionInterval)
    }
  }, [gameStarted, gameOver, birdPosition, obstacleHeight, obstacleLeft])

  const restartGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setScore(0)
    setBirdPosition(50)
    setObstacleHeight(150)
    setObstacleLeft(400)
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-sky-200">
      <div className="relative w-[400px] h-[400px] bg-sky-300 border-4 border-sky-600 overflow-hidden">
        <div
          className="absolute w-[40px] h-[40px] bg-yellow-400 rounded-full"
          style={{ top: `${birdPosition}px`, left: '20px' }}
        />
        <div
          className="absolute w-[60px] bg-green-600"
          style={{
            height: `${obstacleHeight}px`,
            left: `${obstacleLeft}px`,
            top: 0,
          }}
        />
        <div
          className="absolute w-[60px] bg-green-600"
          style={{
            height: `${400 - obstacleHeight - 100}px`,
            left: `${obstacleLeft}px`,
            bottom: 0,
          }}
        />
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl">
            Click or press space to start
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl">
            Game Over
          </div>
        )}
      </div>
      <div className="mt-4 text-2xl font-bold">Score: {score}</div>
      <Button
        onClick={gameOver ? restartGame : jumpBird}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {gameOver ? 'Restart' : 'Jump'}
      </Button>
    </div>
  )
}