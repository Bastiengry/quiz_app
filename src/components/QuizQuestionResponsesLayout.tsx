import { Box, FormControlLabel, FormGroup, Radio, Typography } from '@mui/material'
import type { QuizQuestion, QuizUserResponse } from '../types'

interface QuizQuestionResponsesLayoutProps {
  dataTestId?: string
  quizQuestion: QuizQuestion
  userResponse: QuizUserResponse | undefined
  onResponseSelected: (questionId: number, selectedResponseId: number) => void
}

export default function QuizQuestionResponsesLayout({
  dataTestId,
  quizQuestion,
  userResponse,
  onResponseSelected
}: QuizQuestionResponsesLayoutProps) {
  return (
    <Box component="div" aria-label="quiz-question-responses-layout" data-testid={dataTestId}>
      <Typography aria-label="question">
        <Box component="b">{quizQuestion?.questionLabel}</Box>
      </Typography>
      <FormGroup>
        {quizQuestion.possibleResponses.map((possibleResponse) => (
          <FormControlLabel
            aria-label={`radio-label-${possibleResponse.responseId}`}
            control={
              <Radio
                aria-label={`radio-value-${possibleResponse.responseId}`}
                slotProps={{
                  input: {
                    'aria-label': 'native-input-checkbox'
                  }
                }}
                checked={possibleResponse.responseId === userResponse?.responseId}
                onClick={() => {
                  onResponseSelected(quizQuestion.questionId, possibleResponse.responseId)
                }}
              />
            }
            label={possibleResponse.responseLabel}
            key={possibleResponse.responseId}
          />
        ))}
      </FormGroup>
    </Box>
  )
}
