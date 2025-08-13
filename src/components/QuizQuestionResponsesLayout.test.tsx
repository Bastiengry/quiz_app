import { render, screen, waitFor, within } from '@testing-library/react'
import QuizQuestionResponsesLayout from './QuizQuestionResponsesLayout'
import type { QuizQuestion, QuizUserResponse } from '../types'
import userEvent from '@testing-library/user-event'

const mockQuizQuestion: QuizQuestion = {
  questionId: 1,
  questionLabel: 'What kind of transportation do you use to come to the office ?',
  possibleResponses: [
    {
      responseId: 1,
      responseLabel: 'Train'
    },
    {
      responseId: 2,
      responseLabel: 'Bus'
    },
    {
      responseId: 3,
      responseLabel: 'Car'
    },
    {
      responseId: 4,
      responseLabel: 'Walking'
    }
  ]
}

describe('The QuizQuestionResponsesLayout component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders well the first page when the user did not respond to the quiz', async () => {
    render(
      <QuizQuestionResponsesLayout
        quizQuestion={mockQuizQuestion}
        userResponse={undefined}
        onResponseSelected={() => {}}
      />
    )

    const rootComp = await screen.findByLabelText('quiz-question-responses-layout')

    // Checks that the question is displayed.
    const questionLabelComp = within(rootComp).getByLabelText('question')
    expect(questionLabelComp).toHaveTextContent(mockQuizQuestion.questionLabel)

    // Checks that the responses are displayed but not checked.
    for (const possibleResponse of mockQuizQuestion.possibleResponses) {
      const responseLabelComp = within(rootComp).getByLabelText(
        `radio-label-${possibleResponse.responseId}`
      )
      expect(responseLabelComp).toHaveTextContent(possibleResponse.responseLabel)

      const responseValueComp = within(rootComp).getByLabelText(
        `radio-value-${possibleResponse.responseId}`
      )

      const nativeResponseValueComp =
        within(responseValueComp).getByLabelText('native-input-checkbox')

      expect(nativeResponseValueComp).not.toBeChecked()
    }
  })

  it('renders well the first page when the user selects a response', async () => {
    let mockUserResponse: QuizUserResponse | undefined = undefined

    const { rerender } = render(
      <QuizQuestionResponsesLayout
        quizQuestion={mockQuizQuestion}
        userResponse={undefined}
        onResponseSelected={(questionId, selectedResponseId) => {
          mockUserResponse = { questionId, responseId: selectedResponseId }
        }}
      />
    )

    const rootComp = await screen.findByLabelText('quiz-question-responses-layout')

    // Checks that the question is displayed.
    const questionLabelComp = within(rootComp).getByLabelText('question')
    expect(questionLabelComp).toHaveTextContent(mockQuizQuestion.questionLabel)

    // Selects a response.
    const selectResponseId = mockQuizQuestion.possibleResponses[2].responseId
    const responseLabelComp = within(rootComp).getByLabelText(`radio-label-${selectResponseId}`)

    // Clicks on the response
    await waitFor(() => userEvent.click(responseLabelComp))

    // Re-render because we modified a props
    rerender(
      <QuizQuestionResponsesLayout
        quizQuestion={mockQuizQuestion}
        userResponse={mockUserResponse}
        onResponseSelected={(questionId, selectedResponseId) => {
          mockUserResponse = { questionId, responseId: selectedResponseId }
        }}
      />
    )

    // Checks that the response is selected
    const responseValueComp = within(rootComp).getByLabelText(`radio-value-${selectResponseId}`)

    const nativeResponseValueComp =
      within(responseValueComp).getByLabelText('native-input-checkbox')

    expect(nativeResponseValueComp).toBeChecked()
  })
})
