export type Questions = Question[]

export type Question = {
    id: number,
    question: string,
    description: string,
    answers: Record<string, string>,
    multiple_correct_answers: string,
    correct_answers: Record<string, string>,
    correct_answer: string,
    explanation: string,
    tip: string,
    tags: Tag[],
    category: string
}

type Tag = {
    name: string
}