import { useCallback } from 'react'
import { useCurrentUserContext } from '../context'
import { dummyQuiz } from '../dummy'
import type { QuizUserResponse, QuizUserResponses } from '../types'

const usersQuizReponses: QuizUserResponses[] = []

const REGEX_URL_USER_RESPONSES = /^\/api\/v1\/quiz\/\d*\/user-responses$/

export default function useHttp() {
  const { email } = useCurrentUserContext()
  const httpGet = useCallback(
    (url: string) => {
      if (url === '/api/v1/quiz/current') {
        return dummyQuiz
      } else if (url.match(REGEX_URL_USER_RESPONSES)) {
        if (email) {
          return usersQuizReponses.find((userQuizReponses) => userQuizReponses.userEmail === email)
        } else {
          throw Error('No user connected')
        }
      } else {
        throw Error('Unexpected URL')
      }
    },
    [email]
  )

  const httpPost = useCallback(
    (url: string, body: object | undefined) => {
      if (url.match(REGEX_URL_USER_RESPONSES)) {
        if (email) {
          const indexToRemove = usersQuizReponses.findIndex(
            (userQuizReponses) => userQuizReponses.userEmail === email
          )
          if (indexToRemove > 0) {
            usersQuizReponses.splice(indexToRemove, 1)
          }
          usersQuizReponses.push({
            userEmail: email,
            responses: body as QuizUserResponse[]
          })
        } else {
          throw Error('No user connected')
        }
      } else {
        throw Error('Unexpected URL')
      }
    },
    [email]
  )

  return {
    httpGet,
    httpPost
  }
}
