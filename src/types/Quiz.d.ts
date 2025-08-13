export interface Quiz {
  quizId: number
  title: string
  questions: QuizQuestion[]
}

export interface QuizResponse {
  responseId: number
  responseLabel: string
}

export interface QuizQuestion {
  questionId: number
  questionLabel: string
  possibleResponses: QuizResponse[]
  displayCondition?: QuizQuestionDisplayCondition
}

export interface QuizQuestionDisplayCondition {
  questionId: number
  responseId: number
}

export interface QuizUserResponses {
  userEmail: string
  responses: QuizUserResponse[]
}

export interface QuizUserResponse {
  questionId: number
  responseId: number
}
