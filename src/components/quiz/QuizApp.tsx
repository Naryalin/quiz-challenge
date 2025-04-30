import { useState, useEffect } from "react"
import type { Questions } from "../../types/api"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import "./QuizApp.css"

export default function QuizApp({ children, questions: initialQuestions } : { children: React.ReactNode, questions?: Questions }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(30)
    const [isTimerRunning, setIsTimerRunning] = useState(true)

    const [questions, setQuestions] = useState<Questions>(initialQuestions || []);

    const currentQuestion = questions[currentQuestionIndex]

    const resetQuestionState = () => {
        setSelectedAnswer(null)
        setIsAnswered(false)
        setTimeLeft(30)
        setIsTimerRunning(true)
    }

    useEffect(() => {
        let timer: number | null = null
    
        if (isTimerRunning && timeLeft > 0) {
          timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1)
          }, 1000)
        } else if (timeLeft === 0 && isTimerRunning) {
          setIsTimerRunning(false)
          setIsAnswered(true)
        }
    
        return () => {
          if (timer) clearTimeout(timer)
        }
    }, [timeLeft, isTimerRunning])

    const isCorrect = (answerKey: string) => {
        const correctAnswerKey = `${answerKey}_correct`
        return currentQuestion?.correct_answers[correctAnswerKey as keyof typeof currentQuestion.correct_answers] === "true"
    }
    
    const selectAnswer = (answerKey: string) => {
        if (isAnswered) return
    
        setSelectedAnswer(answerKey)
        setIsAnswered(true)
        setIsTimerRunning(false)
    
        if (isCorrect(answerKey)) {
          setScore(score + 1)
        }
    }

    const moveToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          resetQuestionState()
        }
    }

    const getValidAnswers = () => {
        if (!currentQuestion) return []
        return Object.entries(currentQuestion.answers)
            .filter(([_, value]) => value !== null)
            .map(([key, value]) => ({ key, value }));
    }

    return (
        <main className="min-w-screen min-h-screen w-full overflow-hidden">
            {children}
            <h1 className="text-center mt-20">Question {currentQuestionIndex} / {questions.length}</h1>
            <p className="question text-center max-w-[50%] mx-auto">{currentQuestion?.question}</p>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className={`font-medium ${timeLeft < 10 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
            </div>
            <section className="Options flex items-center justify-center flex-col">
              {getValidAnswers().map(({ key, value }) => (
              <div
                key={key}
                className={`valid-answer p-4 border-2 max-w-[50%] w-full cursor-pointer transition-all bg-white  ${selectedAnswer === key ? 'highlight' : ''} hover:highlight`}
                onClick={() => selectAnswer(key)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-">{value}</p>
                  {isAnswered && (
                    <div>
                      {isCorrect(key) ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        selectedAnswer === key && <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            </section>
        </main>
    );
}