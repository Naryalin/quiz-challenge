import { QUIZ_API_KEY } from 'astro:env/server';
import { type Questions } from '../types/api';
const apiKey = QUIZ_API_KEY;
export async function getQuizzes() {
    if (!apiKey) {
        throw new Error('API KEY not found'); 
    }
    const response = await fetch("https://quizapi.io/api/v1/questions", {
        headers: {
            'X-Api-Key': apiKey
        }
    });
    const questions = await response.json();
    return questions as Questions;
}
export async function getCategories() {
    if (!apiKey) {
        throw new Error('API KEY not found'); 
    }
    const response = await fetch("https://quizapi.io/api/v1/categories", {
        headers: {
            'X-Api-Key': apiKey
        }
    });
    const categories = await response.json();
    return categories;
}