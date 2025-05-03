import { useState, useEffect } from "react"
import type { Questions } from "../../types/api"
import { navigate } from "astro:transitions/client"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import "./QuizApp.css"

const sampleQuestions : Questions = [
  {
    id: 7368,
    question: "Which command redirects only the standard error to a file?",
    description: "Understanding how to capture error messages separately.",
    answers: {
      answer_a: "command 2> error.log",
      answer_b: "command > error.log",
      answer_c: "command 1> error.log",
      answer_d: "command >> error.log",
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "true",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "false",
      answer_e_correct: "false",
      answer_f_correct: "false",
    },
    correct_answer: null,
    explanation: "Using `2>` redirects standard error output to a file.",
    tip: null,
    tags: [
      {
        name: "BASH",
      },
    ],
    category: "Docker",
    difficulty: "Easy",
  },
  {
    id: 7369,
    question: "What does the Docker command 'docker ps' do?",
    description: "Understanding basic Docker commands.",
    answers: {
      answer_a: "Lists all running containers",
      answer_b: "Lists all containers (running and stopped)",
      answer_c: "Lists all Docker images",
      answer_d: "Stops all running containers",
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "true",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "false",
      answer_e_correct: "false",
      answer_f_correct: "false",
    },
    correct_answer: null,
    explanation: "The 'docker ps' command lists all currently running containers.",
    tip: "Use 'docker ps -a' to see all containers including stopped ones.",
    tags: [
      {
        name: "Docker",
      },
    ],
    category: "Docker",
    difficulty: "Medium",
  },
  {
    id: 7370,
    question: "Which SQL statement is used to extract data from a database?",
    description: "Understanding basic SQL commands.",
    answers: {
      answer_a: "SELECT",
      answer_b: "EXTRACT",
      answer_c: "GET",
      answer_d: "OPEN",
    },
    multiple_correct_answers: "false",
    correct_answers: {
      answer_a_correct: "true",
      answer_b_correct: "false",
      answer_c_correct: "false",
      answer_d_correct: "false",
      answer_e_correct: "false",
      answer_f_correct: "false",
    },
    correct_answer: null,
    explanation: "The SELECT statement is used to select data from a database.",
    tip: null,
    tags: [
      {
        name: "SQL",
      },
      {
        name: "Database",
      },
    ],
    category: "SQL",
    difficulty: "Hard",
  },
]
export default function QuizApp({ children, questions: initialQuestions } : { children: React.ReactNode, questions?: Questions }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [hoveredAnswer, setHoveredAnswer] = useState<string | null>(null)
    const [isClient, setIsClient] = useState(false)
    const [isAnswered, setIsAnswered] = useState(false)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(300)
    const [isTimerRunning, setIsTimerRunning] = useState(true)

    const [questions, setQuestions] = useState<Questions>(initialQuestions || sampleQuestions);

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

    useEffect(() => {
      setIsClient(true)
    }, [])

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

    if (!isClient) return null

    return (
        <main className="min-w-screen min-h-screen w-full overflow-hidden">
            {children}
            <h1 className="text-center mt-20">Question {currentQuestionIndex+1} / {questions.length}</h1>
            <p className="question text-center max-w-[50%] mx-auto">{currentQuestion?.question}</p>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className={`font-medium ${timeLeft < 10 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
            </div>
            <section className="Options flex items-center justify-center flex-col gap-2">
              {getValidAnswers().map(({ key, value }, index) => (
              <div
                key={key}
                className={`valid-answer p-4 border-2 max-w-[50%] w-full cursor-pointer transition-all bg-white ${selectedAnswer === key || hoveredAnswer === key || (isAnswered && isCorrect(key)) ? 'highlight' : ''}`}
                onClick={isAnswered ? undefined : () => selectAnswer(key)}
                onMouseEnter={isAnswered ? undefined : () => setHoveredAnswer(key)}
                onMouseLeave={isAnswered ? undefined : () => setHoveredAnswer(null)}
              >
                <div className="flex items-center justify-start">
                  <span className={`letter-answer rounded-full border-2 w-8 h-8 min-h-8 min-w-8 flex items-center justify-center ${selectedAnswer === key || hoveredAnswer === key || (isAnswered && isCorrect(key)) ? 'highlight' : ''}`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <p className={`answer ml-2 ${selectedAnswer === key || hoveredAnswer === key || (isAnswered && isCorrect(key)) ? 'highlight' : ''}`}>{value}</p>
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
            <div className="flex items-center justify-center mt-4">
              <button
                className={`next-button px-4 py-2 text-white ${
                  !isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => {
                  if (currentQuestionIndex === questions.length - 1) {
                    navigate('/results')
                  } else {
                    moveToNextQuestion();
                  }
                }}
                disabled={!isAnswered}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
            
        </main>
    );
}