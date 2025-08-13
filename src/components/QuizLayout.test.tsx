import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuizLayout from './QuizLayout'
import type { Quiz, QuizUserResponse } from '../types'

const mockQuiz: Quiz = {
  quizId: 1,
  title: 'Transportation quiz',
  questions: [
    {
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
    },
    {
      questionId: 2,
      questionLabel: 'Why did you choose this transportation ?',
      possibleResponses: [
        {
          responseId: 11,
          responseLabel: 'Time saving'
        },
        {
          responseId: 12,
          responseLabel: 'Money saving'
        },
        {
          responseId: 13,
          responseLabel: 'More safe'
        },
        {
          responseId: 14,
          responseLabel: 'Environment protection'
        },
        {
          responseId: 15,
          responseLabel: 'No possible alternative'
        },
        {
          responseId: 16,
          responseLabel: 'Other reason'
        }
      ]
    },
    {
      questionId: 3,
      questionLabel: 'What can convince you to change transportation ? (Optional exercise)',
      possibleResponses: [
        {
          responseId: 21,
          responseLabel: 'Time saving'
        },
        {
          responseId: 22,
          responseLabel: 'Money saving'
        },
        {
          responseId: 23,
          responseLabel: 'Environment protection'
        },
        {
          responseId: 24,
          responseLabel: 'Other reason'
        }
      ],
      displayCondition: {
        questionId: 2,
        responseId: 12
      }
    },
    {
      questionId: 4,
      questionLabel: 'Do you accept to share your answers with the statistic departement ?',
      possibleResponses: [
        {
          responseId: 31,
          responseLabel: 'Yes'
        },
        {
          responseId: 32,
          responseLabel: 'No'
        }
      ]
    }
  ]
}

describe('The QuizLayout component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders well the first page when the user did not respond to the quiz', async () => {
    render(
      <QuizLayout
        quiz={mockQuiz}
        alreadyResponsed={false}
        userResponses={[]}
        onResponseSelected={() => {}}
        saveUserResponses={() => {}}
      />
    )

    // Checks that the title of the quiz is displayed.
    const titleComp = await screen.findByLabelText('quiz-layout-title')
    expect(titleComp).toHaveTextContent(`Quiz of the day: ${mockQuiz.title}`)

    // Checks that the question is displayed.
    const question = mockQuiz.questions[0]
    const questionResponsesLayout = await screen.findByTestId('quiz-question-responses-layout')
    const questionLabelComp = within(questionResponsesLayout).getByLabelText('question')
    expect(questionLabelComp).toHaveTextContent(question.questionLabel)

    // Checks that the responses are displayed but not checked.
    for (const possibleResponse of question.possibleResponses) {
      const responseLabelComp = within(questionResponsesLayout).getByLabelText(
        `radio-label-${possibleResponse.responseId}`
      )
      expect(responseLabelComp).toHaveTextContent(possibleResponse.responseLabel)

      const responseValueComp = within(questionResponsesLayout).getByLabelText(
        `radio-value-${possibleResponse.responseId}`
      )

      const nativeResponseValueComp =
        within(responseValueComp).getByLabelText('native-input-checkbox')

      expect(nativeResponseValueComp).not.toBeChecked()
    }

    // Checks that the previous button is disabled.
    const btnPrevious = screen.getByLabelText('btn-previous')
    expect(btnPrevious).toBeDisabled()

    // Checks that the next button is disabled.
    const btnNext = screen.getByLabelText('btn-next')
    expect(btnNext).toBeDisabled()

    // Checks that the save button is hidden.
    const btnSave = screen.queryByLabelText('btn-save')
    expect(btnSave).not.toBeInTheDocument()
  })

  it('renders well the first page when the user already responded to the first question', async () => {
    const mockUserResponses: QuizUserResponse[] = [
      {
        questionId: 1,
        responseId: 2
      }
    ]

    render(
      <QuizLayout
        quiz={mockQuiz}
        alreadyResponsed={false}
        userResponses={mockUserResponses}
        onResponseSelected={() => {}}
        saveUserResponses={() => {}}
      />
    )

    // Checks that the title of the quiz is displayed.
    const titleComp = await screen.findByLabelText('quiz-layout-title')
    expect(titleComp).toHaveTextContent(`Quiz of the day: ${mockQuiz.title}`)

    // Checks that the question is displayed.
    const question = mockQuiz.questions[0]
    const questionResponsesLayout = await screen.findByTestId('quiz-question-responses-layout')
    const questionLabelComp = within(questionResponsesLayout).getByLabelText('question')
    expect(questionLabelComp).toHaveTextContent(question.questionLabel)

    // Response which must be selected.
    const checkedResponse = question.possibleResponses[1]

    // Checks that the response is selected.
    const responseLabelComp = within(questionResponsesLayout).getByLabelText(
      `radio-label-${checkedResponse.responseId}`
    )
    expect(responseLabelComp).toHaveTextContent(checkedResponse.responseLabel)

    const responseValueComp = within(questionResponsesLayout).getByLabelText(
      `radio-value-${checkedResponse.responseId}`
    )

    const nativeResponseValueComp =
      within(responseValueComp).getByLabelText('native-input-checkbox')

    expect(nativeResponseValueComp).toBeChecked()

    // Checks that the previous button is disabled.
    const btnPrevious = screen.getByLabelText('btn-previous')
    expect(btnPrevious).toBeDisabled()

    // Checks that the next button is enabled.
    const btnNext = screen.getByLabelText('btn-next')
    expect(btnNext).not.toBeDisabled()

    // Checks that the save button is hidden.
    const btnSave = screen.queryByLabelText('btn-save')
    expect(btnSave).not.toBeInTheDocument()
  })

  it('renders the second page when selecting an answer and clicking next', async () => {
    const mockUserResponses: QuizUserResponse[] = []

    const { rerender } = render(
      <QuizLayout
        quiz={mockQuiz}
        alreadyResponsed={false}
        userResponses={mockUserResponses}
        onResponseSelected={(questionId: number, selectedResponseId: number) => {
          mockUserResponses.push({
            questionId,
            responseId: selectedResponseId
          })
        }}
        saveUserResponses={() => {}}
      />
    )

    // Checks that the title of the quiz is displayed.
    const titleComp = await screen.findByLabelText('quiz-layout-title')
    expect(titleComp).toHaveTextContent(`Quiz of the day: ${mockQuiz.title}`)

    // Checks that the question is displayed.
    const question = mockQuiz.questions[0]
    const questionResponsesLayout = await screen.findByTestId('quiz-question-responses-layout')
    const questionLabelComp = within(questionResponsesLayout).getByLabelText('question')
    expect(questionLabelComp).toHaveTextContent(question.questionLabel)

    // Response which must be selected.
    const checkedResponse = question.possibleResponses[1]

    // Gets a response to click on.
    const responseLabelComp = within(questionResponsesLayout).getByLabelText(
      `radio-label-${checkedResponse.responseId}`
    )
    expect(responseLabelComp).toHaveTextContent(checkedResponse.responseLabel)

    const responseValueComp = within(questionResponsesLayout).getByLabelText(
      `radio-value-${checkedResponse.responseId}`
    )

    const nativeResponseValueComp =
      within(responseValueComp).getByLabelText('native-input-checkbox')

    // Clicks on the response
    await waitFor(() => userEvent.click(responseLabelComp))

    // Reredeners because we updated a props on the previous event
    rerender(
      <QuizLayout
        quiz={mockQuiz}
        alreadyResponsed={false}
        userResponses={mockUserResponses}
        onResponseSelected={(questionId: number, selectedResponseId: number) => {
          mockUserResponses.push({
            questionId,
            responseId: selectedResponseId
          })
        }}
        saveUserResponses={() => {}}
      />
    )

    // Checks that the response is selected
    expect(nativeResponseValueComp).toBeChecked()

    // Checks that the previous button is enabled.
    let btnPrevious = screen.getByLabelText('btn-previous')
    expect(btnPrevious).toBeDisabled()

    // Checks that the next button is enabled.
    let btnNext = screen.getByLabelText('btn-next')
    expect(btnNext).not.toBeDisabled()

    // Clicks on the next button
    await waitFor(() => userEvent.click(btnNext))

    // Checks that the question 2 is displayed.
    const question2 = mockQuiz.questions[1]
    const question2ResponsesLayout = await screen.findByTestId('quiz-question-responses-layout')
    const question2LabelComp = within(question2ResponsesLayout).getByLabelText('question')
    expect(question2LabelComp).toHaveTextContent(question2.questionLabel)

    // Checks that the previous button is disabled.
    btnPrevious = screen.getByLabelText('btn-previous')
    expect(btnPrevious).not.toBeDisabled()

    // Checks that the next button is enabled.
    btnNext = screen.getByLabelText('btn-next')
    expect(btnNext).toBeDisabled()
  })

  it('does not display question 3 when clicking "next" because response to question 2 is response with responseId 11 (expecting responseId 12 to display question 3)', async () => {
    const mockUserResponses: QuizUserResponse[] = [
      {
        questionId: 1,
        responseId: 1
      },
      {
        questionId: 2,
        responseId: 11
      },
      {
        questionId: 3,
        responseId: 23
      }
    ]

    render(
      <QuizLayout
        quiz={mockQuiz}
        alreadyResponsed={false}
        userResponses={mockUserResponses}
        onResponseSelected={() => {}}
        saveUserResponses={() => {}}
      />
    )

    // Checks that the next button is enabled.
    const btnNext = screen.getByLabelText('btn-next')
    expect(btnNext).not.toBeDisabled()

    // Checks that the first question is displayed.
    const questionResponsesLayout = await screen.findByTestId('quiz-question-responses-layout')
    const questionLabelComp = within(questionResponsesLayout).getByLabelText('question')
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[0].questionLabel)

    // Clicks on the next button to go to the second question.
    await waitFor(() => userEvent.click(btnNext))

    // Checks that the second question is displayed.
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[1].questionLabel)

    // Clicks on the next button to go to the fourth question (AND NOT THE THIRD).
    await waitFor(() => userEvent.click(btnNext))

    // Checks that the fourth question is displayed.
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[3].questionLabel)
  })

  it('navigates to the previous page when clicking on the previous button', async () => {
    const mockUserResponses: QuizUserResponse[] = [
      {
        questionId: 1,
        responseId: 1
      },
      {
        questionId: 2,
        responseId: 12
      },
      {
        questionId: 3,
        responseId: 23
      }
    ]

    render(
      <QuizLayout
        quiz={mockQuiz}
        alreadyResponsed={false}
        userResponses={mockUserResponses}
        onResponseSelected={() => {}}
        saveUserResponses={() => {}}
      />
    )

    // Checks that the next button is enabled.
    const btnNext = screen.getByLabelText('btn-next')
    expect(btnNext).not.toBeDisabled()

    // Checks that the first question is displayed.
    const questionResponsesLayout = await screen.findByTestId('quiz-question-responses-layout')
    const questionLabelComp = within(questionResponsesLayout).getByLabelText('question')
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[0].questionLabel)

    // Clicks on the next button to go to the second question.
    await waitFor(() => userEvent.click(btnNext))

    //Checks that the second question is displayed.
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[1].questionLabel)

    // Checks that the previous button is enabled.
    const btnPrevious = screen.getByLabelText('btn-previous')
    expect(btnPrevious).not.toBeDisabled()

    // Clicks on the previous button to go to the first question.
    await waitFor(() => userEvent.click(btnPrevious))

    // Checks that the first question is displayed.
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[0].questionLabel)
  })

  it('does not display question 3 when clicking "previous" and response to question 2 is responseId 11 (expecting responseId 12 to display question 3)', async () => {
    const mockUserResponses: QuizUserResponse[] = [
      {
        questionId: 1,
        responseId: 1
      },
      {
        questionId: 2,
        responseId: 11
      },
      {
        questionId: 3,
        responseId: 23
      },
      {
        questionId: 4,
        responseId: 31
      }
    ]

    render(
      <QuizLayout
        quiz={mockQuiz}
        alreadyResponsed={false}
        userResponses={mockUserResponses}
        onResponseSelected={() => {}}
        saveUserResponses={() => {}}
      />
    )

    // Checks that the next button is enabled.
    const btnNext = screen.getByLabelText('btn-next')
    expect(btnNext).not.toBeDisabled()

    // Checks that the first question is displayed.
    const questionResponsesLayout = await screen.findByTestId('quiz-question-responses-layout')
    const questionLabelComp = within(questionResponsesLayout).getByLabelText('question')
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[0].questionLabel)

    // Clicks on the next button to go to the second question.
    await waitFor(() => userEvent.click(btnNext))

    //Checks that the second question is displayed.
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[1].questionLabel)

    // Checks that the second question is displayed.
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[1].questionLabel)

    // Clicks on the next button to go to the fourth question (AND NOT THE THIRD).
    await waitFor(() => userEvent.click(btnNext))

    // Checks that the fourth question is displayed.
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[3].questionLabel)

    // Checks that the previous button is enabled.
    const btnPrevious = screen.getByLabelText('btn-previous')
    expect(btnPrevious).not.toBeDisabled()

    // Clicks on the previous button to go to the first question.
    await waitFor(() => userEvent.click(btnPrevious))

    // Checks that the first question is displayed.
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[1].questionLabel)
  })

  it('renders well the last page (with optional question)', async () => {
    const mockUserResponses: QuizUserResponse[] = [
      {
        questionId: 1,
        responseId: 1
      },
      {
        questionId: 2,
        responseId: 12
      },
      {
        questionId: 3,
        responseId: 23
      },
      {
        questionId: 4,
        responseId: 31
      }
    ]

    const mockSaveUserResponses = jest.fn()

    render(
      <QuizLayout
        quiz={mockQuiz}
        alreadyResponsed={false}
        userResponses={mockUserResponses}
        onResponseSelected={() => {}}
        saveUserResponses={mockSaveUserResponses}
      />
    )

    // Checks that the next button is enabled.
    const btnNext = screen.getByLabelText('btn-next')
    expect(btnNext).not.toBeDisabled()

    // Checks that the first question is displayed.
    const questionResponsesLayout = await screen.findByTestId('quiz-question-responses-layout')
    const questionLabelComp = within(questionResponsesLayout).getByLabelText('question')
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[0].questionLabel)

    // Checks that the resume of the questions and given answers is NOT displayed.
    expect(screen.queryByTestId('quiz-resume')).not.toBeInTheDocument()

    // Clicks on the next button to go to the second question
    await waitFor(() => userEvent.click(btnNext))

    // Waits for the second question to be displayed
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[1].questionLabel)

    // Checks that the resume of the questions and given answers is NOT displayed.
    expect(screen.queryByTestId('quiz-resume')).not.toBeInTheDocument()

    // Clicks on the next button to go to the third question
    await waitFor(() => userEvent.click(btnNext))

    // Waits for the third question to be displayed
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[2].questionLabel)

    // Checks that the resume of the questions and given answers is NOT displayed.
    expect(screen.queryByTestId('quiz-resume')).not.toBeInTheDocument()

    // Clicks on the next button to go to the fourth question
    await waitFor(() => userEvent.click(btnNext))

    // Waits for the fourth question to be displayed
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[3].questionLabel)

    // Checks that the resume of the questions and given answers is NOT displayed.
    expect(screen.queryByTestId('quiz-resume')).not.toBeInTheDocument()

    // Clicks on the next button to go to the last page
    await waitFor(() => userEvent.click(btnNext))

    // Checks that the resume of the questions and given answers is displayed.
    screen.findByTestId('quiz-resume')

    // Checks to click on save.
    const btnSave = await screen.findByLabelText('btn-save')
    expect(btnSave).not.toBeDisabled()

    // Clicks on the save button
    await waitFor(() => userEvent.click(btnSave))

    // Checks the call of the save method
    expect(mockSaveUserResponses).toHaveBeenCalled()

    // Checks the display of the notification of successful saving
    screen.getByTestId('notif-save-success')
  })

  it('renders directly the last page when user has already responded to the quiz', async () => {
    const mockUserResponses: QuizUserResponse[] = [
      {
        questionId: 1,
        responseId: 1
      },
      {
        questionId: 2,
        responseId: 12
      },
      {
        questionId: 3,
        responseId: 23
      },
      {
        questionId: 4,
        responseId: 31
      }
    ]

    const mockSaveUserResponses = jest.fn()

    render(
      <QuizLayout
        quiz={mockQuiz}
        alreadyResponsed={true}
        userResponses={mockUserResponses}
        onResponseSelected={() => {}}
        saveUserResponses={mockSaveUserResponses}
      />
    )

    // Checks that the resume is displayed.
    expect(screen.queryByTestId('quiz-resume')).toBeInTheDocument()
  })
})
