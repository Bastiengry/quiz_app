import { useEffect, useCallback, useState } from 'react'
import { QuizLayout } from '../components'
import type { Quiz, QuizQuestion, QuizUserResponse, QuizUserResponses } from '../types'
import { Box, CircularProgress } from '@mui/material'
import { Api } from '../api'
import { useHttp } from '../hooks'
import { useCurrentUserContext } from '../context'

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz | undefined>()
  const [userResponses, setUserResponses] = useState<QuizUserResponse[]>([])
  const [alreadyResponsed, setAlreadyResponsed] = useState<boolean>(false)
  const { httpGet, httpPost } = useHttp()
  const { email } = useCurrentUserContext()

  /**
   * Fills the user responses with a new response.
   *
   * @param questionId ID of the question.
   * @param selectedResponseId ID of the response selected by the user.
   */
  const onResponseSelected = (questionId: number, selectedResponseId: number): void => {
    // Gets all the previous responses, except the one we will modify (if exists)
    let newUserResponses = userResponses.filter((userResp) => userResp.questionId !== questionId)

    // Adds the new response
    newUserResponses.push({
      questionId,
      responseId: selectedResponseId
    })

    // Removes the responses of the linked questions
    newUserResponses = removeLinkedQuestions(questionId, newUserResponses)

    // Updates the state
    setUserResponses(newUserResponses)
  }

  /**
   * Removes the questions linked to the current one from the list of user responses.
   *
   * @param questionId ID of the question.
   * @param newUserResponses responses selected by the user.
   */
  const removeLinkedQuestions = (questionId: number, newUserResponses: QuizUserResponse[]) => {
    const linkedQuestions: QuizQuestion[] = quiz!.questions.filter(
      (quest) => quest.displayCondition?.questionId === questionId
    )
    linkedQuestions.forEach((linkedQuestion) => {
      newUserResponses = newUserResponses.filter(
        (newUserResponse) => newUserResponse.questionId !== linkedQuestion.questionId
      )
    })
    return newUserResponses
  }

  const loadQuiz = useCallback((): Quiz | undefined => {
    const quiz = httpGet(Api.QuizApi.getCurrentQuiz()) as Quiz | undefined
    return quiz
  }, [httpGet])

  const loadUserQuizResponses = useCallback(
    (quiz: Quiz): QuizUserResponse[] | undefined => {
      if (email) {
        const userAndResponses: QuizUserResponses | undefined = httpGet(
          Api.QuizApi.getUserResponses(quiz.quizId)
        ) as QuizUserResponses | undefined
        return userAndResponses?.responses
      }
    },
    [httpGet, email]
  )

  const saveUserResponses = () => {
    if (quiz) {
      httpPost(Api.QuizApi.getUserResponses(quiz.quizId), userResponses) as
        | QuizUserResponses
        | undefined
    }
  }

  // Loaded when the component open on the first time only.
  useEffect(() => {
    const quiz: Quiz | undefined = loadQuiz()
    if (quiz) {
      // Gets the user responses.
      const currentUserResponse: QuizUserResponse[] | undefined = loadUserQuizResponses(quiz)

      /** Sets the states (at the end of the loadings).*/
      // In a real use case (with backend), the load methods are asynchronous, and then setting
      // the states in them will cause a double refresh of the screen with potentially the
      // bad screen displayed and blinking.

      // State for "already responsed to quiz"
      setAlreadyResponsed(!!currentUserResponse && currentUserResponse.length > 0)

      // State for user response.
      if (currentUserResponse) {
        setUserResponses(currentUserResponse)
      }

      // State for quiz.
      setQuiz(quiz)
    }
  }, [loadQuiz, loadUserQuizResponses])

  return (
    <Box
      component="div"
      aria-label="quiz-page"
      sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      {quiz ? (
        <QuizLayout
          dataTestId="quiz-layout"
          quiz={quiz}
          alreadyResponsed={alreadyResponsed}
          userResponses={userResponses}
          onResponseSelected={onResponseSelected}
          saveUserResponses={saveUserResponses}
        />
      ) : (
        <CircularProgress />
      )}
    </Box>
  )
}
