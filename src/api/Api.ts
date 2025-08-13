const QuizApi = {
  getCurrentQuiz: (): string => '/api/v1/quiz/current',
  getUserResponses: (quizId: number): string => `/api/v1/quiz/${quizId}/user-responses`
}

export default { QuizApi }
