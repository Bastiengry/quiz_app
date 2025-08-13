import React from 'react'
import { Divider, List, ListItem, ListItemText } from '@mui/material'
import type { Quiz, QuizQuestion, QuizUserResponse } from '../types'

interface QuizResumeProps {
  dataTestId?: string
  quiz: Quiz
  userResponses: QuizUserResponse[]
}

export default function QuizResume({ dataTestId, quiz, userResponses }: QuizResumeProps) {
  /**
   * Find the response selected by the user.
   * @param questionId ID of the question.
   * @returns user response
   */
  const findUserResponseForQuestionId = (questionId: number): QuizUserResponse | undefined => {
    return userResponses.find((userResp) => userResp.questionId === questionId)
  }

  /**
   * Find the label of the response selected by the user.
   * @param quizQuestion quiz question.
   * @returns user response
   */
  const findUserResponseTextForQuestion = (quizQuestion: QuizQuestion): string | undefined => {
    // Find the response ID selected by the user.
    const userResponse = findUserResponseForQuestionId(quizQuestion.questionId)

    // Returns the response label.
    return quizQuestion.possibleResponses.find(
      (resp) => resp.responseId === userResponse?.responseId
    )?.responseLabel
  }

  const canDisplayQuestion = (quizQuestion: QuizQuestion): boolean => {
    let result: boolean = false
    if (quizQuestion.displayCondition) {
      const displayCondQuestionId = quizQuestion.displayCondition.questionId
      const displayCondResponseId = quizQuestion.displayCondition.responseId
      const userResponse = findUserResponseForQuestionId(displayCondQuestionId)
      if (userResponse?.responseId === displayCondResponseId) {
        result = true
      }
    } else {
      result = true
    }
    return result
  }

  return (
    <List sx={{ width: '100%' }} aria-label="quiz-resume" data-testid={dataTestId}>
      {quiz.questions?.map((quizQuestion, mapIndex) => (
        <React.Fragment key={quizQuestion.questionId}>
          {canDisplayQuestion(quizQuestion) && (
            <>
              <ListItem aria-label="item" alignItems="flex-start">
                <ListItemText
                  aria-label="item-text"
                  primary={quizQuestion.questionLabel}
                  secondary={findUserResponseTextForQuestion(quizQuestion)}
                />
              </ListItem>
              {mapIndex !== quiz.questions?.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </List>
  )
}
