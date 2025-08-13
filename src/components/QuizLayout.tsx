import { useState } from 'react'
import { Alert, AlertTitle, Button, Grid, Paper, Typography } from '@mui/material'
import type { QuizQuestion, Quiz, QuizUserResponse, QuizQuestionDisplayCondition } from '../types'
import QuizQuestionResponsesLayout from './QuizQuestionResponsesLayout'
import QuizResume from './QuizResume'

interface QuizLayoutProps {
  dataTestId?: string
  quiz: Quiz
  alreadyResponsed: boolean
  userResponses: QuizUserResponse[]
  onResponseSelected: (questionId: number, selectedResponseId: number) => void
  saveUserResponses: () => void
}

export default function QuizLayout({
  dataTestId,
  quiz,
  alreadyResponsed,
  userResponses,
  onResponseSelected,
  saveUserResponses
}: QuizLayoutProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [showSaved, setShowSaved] = useState<boolean>(false)
  const [showButtons, setShowButtons] = useState<boolean>(true)

  let currentQuizQuestion: QuizQuestion | undefined = undefined
  if (quiz.questions.length > currentQuestionIndex) {
    currentQuizQuestion = quiz.questions[currentQuestionIndex]
  }

  let userResponse: QuizUserResponse | undefined = undefined
  if (currentQuizQuestion) {
    userResponse = userResponses.find(
      (userResp) => userResp.questionId === currentQuizQuestion.questionId
    )
  }

  const canDisplayWithQuestion = (
    displayCondition: QuizQuestionDisplayCondition | undefined
  ): boolean => {
    if (displayCondition) {
      return !!userResponses.find(
        (userResp) =>
          userResp.questionId === displayCondition.questionId &&
          userResp.responseId === displayCondition.responseId
      )
    }
    return true
  }

  const selectPreviousQuestion = (): void => {
    let index = 0
    for (let i = currentQuestionIndex - 1; i > 0; i--) {
      const quizQuestion: QuizQuestion = quiz.questions[i]
      if (canDisplayWithQuestion(quizQuestion.displayCondition)) {
        index = i
        break
      }
    }
    setCurrentQuestionIndex(index)
  }

  const selectNextQuestion = (): void => {
    let index = quiz.questions.length
    for (let i = currentQuestionIndex + 1; i < quiz.questions.length; i++) {
      const quizQuestion: QuizQuestion = quiz.questions[i]
      if (canDisplayWithQuestion(quizQuestion.displayCondition)) {
        index = i
        break
      }
    }
    setCurrentQuestionIndex(index)
  }

  const onSave = () => {
    saveUserResponses()
    setShowSaved(true)
    setShowButtons(false)
  }

  return (
    <Paper
      data-testid={dataTestId}
      aria-label="quiz-layout"
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        padding: '10px',
        maxWidth: '900px'
      }}
    >
      <Grid container spacing={2} alignContent="center" sx={{ paddingTop: '10px' }}>
        <Grid size={12}>
          <Typography aria-label="quiz-layout-title" variant="h4" style={{ textAlign: 'center' }}>
            Quiz of the day: {quiz.title}
          </Typography>
        </Grid>
        <Grid aria-label="quiz-layout-content" size={12}>
          {!alreadyResponsed && currentQuizQuestion && (
            <QuizQuestionResponsesLayout
              dataTestId="quiz-question-responses-layout"
              quizQuestion={currentQuizQuestion}
              userResponse={userResponse}
              onResponseSelected={onResponseSelected}
            />
          )}
          {(alreadyResponsed || currentQuestionIndex === quiz.questions.length) && (
            <QuizResume dataTestId="quiz-resume" quiz={quiz} userResponses={userResponses} />
          )}
        </Grid>
        {!alreadyResponsed && showButtons && (
          <Grid
            aria-label="quiz-layout-buttons"
            size={12}
            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px' }}
          >
            <Button
              aria-label="btn-previous"
              variant="contained"
              disabled={currentQuestionIndex === 0}
              onClick={selectPreviousQuestion}
            >
              Previous
            </Button>
            {currentQuestionIndex < quiz.questions.length && (
              <Button
                aria-label="btn-next"
                variant="contained"
                disabled={!userResponse?.responseId}
                onClick={selectNextQuestion}
              >
                Next
              </Button>
            )}
            {currentQuestionIndex === quiz.questions.length && (
              <Button color="success" aria-label="btn-save" variant="contained" onClick={onSave}>
                Save
              </Button>
            )}
          </Grid>
        )}
        {showSaved && (
          <Grid
            aria-label="quiz-layout-notification"
            size={12}
            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
          >
            <Alert
              data-testid="notif-save-success"
              severity="success"
              sx={{ minWidth: '250px', width: '50vw' }}
            >
              <AlertTitle>Success</AlertTitle>
              Responses saved. Thank you for your participation.
            </Alert>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}
