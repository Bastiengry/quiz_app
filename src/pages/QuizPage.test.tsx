import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuizPage from './QuizPage'
import { CurrentUserContext } from '../context'
import type { Quiz, QuizUserResponses } from '../types'
import { Api } from '../api'

const mockQuiz: Quiz = {
  quizId: 1,
  title: 'Transportation quiz (MOCK)',
  questions: [
    {
      questionId: 1,
      questionLabel: 'What kind of transportation do you use to come to the office ? (MOCK)',
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
      questionLabel: 'Why did you choose this transportation ? (MOCK)',
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
      questionLabel: 'What can convince you to change transportation ? (Optional exercise) (MOCK)',
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
      questionLabel: 'Do you accept to share your answers with the statistic departement ? (MOCK)',
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

const mockUseHttp = jest.fn().mockImplementation(() => ({
  httpGet: (url: string) => {
    switch (url) {
      case '/api/v1/quiz/current':
        return mockQuiz
      case `/api/v1/quiz/${mockQuiz.quizId}/user-responses`:
        return []
      default:
        throw Error('Undefined')
    }
  }
}))

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useHttp: () => mockUseHttp()
}))

describe('The QuizPage component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders well', async () => {
    render(
      <CurrentUserContext.Provider
        value={{
          email: 'test@test.com',
          onLogin: () => {}
        }}
      >
        <QuizPage />
      </CurrentUserContext.Provider>
    )

    // Waits for the screen to load
    const quizPage = await screen.findByLabelText('quiz-page')

    // Checks the display of the quiz layout
    const quizLayout = await within(quizPage).findByTestId('quiz-layout')

    // Checks the title of the quiz
    const quizTitleComp = within(quizLayout).getByLabelText('quiz-layout-title')
    expect(quizTitleComp).toHaveTextContent(mockQuiz.title)
  })

  it('displays old user responses', async () => {
    const mockUserResponses: QuizUserResponses = {
      userEmail: 'test@test.com',
      responses: [
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
    }

    mockUseHttp.mockImplementation(() => ({
      httpGet: (url: string) => {
        switch (url) {
          case '/api/v1/quiz/current':
            return mockQuiz
          case `/api/v1/quiz/${mockQuiz.quizId}/user-responses`:
            return mockUserResponses
          default:
            throw Error('Undefined')
        }
      }
    }))

    render(
      <CurrentUserContext.Provider
        value={{
          email: 'test@test.com',
          onLogin: () => {}
        }}
      >
        <QuizPage />
      </CurrentUserContext.Provider>
    )

    // Waits for the screen to load
    const quizPage = await screen.findByLabelText('quiz-page')

    // Checks the display of the quiz layout
    const quizLayout = await within(quizPage).findByTestId('quiz-layout')

    // Checks the title of the quiz
    const quizTitleComp = within(quizLayout).getByLabelText('quiz-layout-title')
    expect(quizTitleComp).toHaveTextContent(mockQuiz.title)

    // Checks the display of the resume
    within(quizLayout).getByLabelText('quiz-resume')
  })

  it('displays well when selecting a response', async () => {
    mockUseHttp.mockImplementation(() => ({
      httpGet: (url: string) => {
        switch (url) {
          case '/api/v1/quiz/current':
            return mockQuiz
          case `/api/v1/quiz/${mockQuiz.quizId}/user-responses`:
            return []
          default:
            throw Error('Undefined')
        }
      }
    }))

    render(
      <CurrentUserContext.Provider
        value={{
          email: 'test@test.com',
          onLogin: () => {}
        }}
      >
        <QuizPage />
      </CurrentUserContext.Provider>
    )

    // Waits for the screen to load
    const quizPage = await screen.findByLabelText('quiz-page')

    // Checks the display of the quiz layout
    const quizLayout = await within(quizPage).findByTestId('quiz-layout')

    // Checks the title of the quiz
    const quizTitleComp = within(quizLayout).getByLabelText('quiz-layout-title')
    expect(quizTitleComp).toHaveTextContent(mockQuiz.title)

    // Checks the question of the quiz
    const quizQuestionComp = within(quizLayout).getByLabelText('quiz-question-responses-layout')
    const questionLabelComp = await within(quizQuestionComp).findByLabelText('question')
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[0].questionLabel)

    // Selects a response
    const responseToSelect = mockQuiz.questions[0].possibleResponses[1]

    const responseLabelComp = within(quizQuestionComp).getByLabelText(
      `radio-label-${responseToSelect.responseId}`
    )

    await waitFor(() => userEvent.click(responseLabelComp))

    // Checks that the response is selected
    const responseValueComp = within(quizQuestionComp).getByLabelText(
      `radio-value-${responseToSelect.responseId}`
    )

    const nativeResponseValueComp =
      within(responseValueComp).getByLabelText('native-input-checkbox')

    expect(nativeResponseValueComp).toBeChecked()
  })

  it('can save the selected responses', async () => {
    const mockHttpPost = jest.fn()
    mockUseHttp.mockImplementation(() => ({
      httpGet: (url: string) => {
        switch (url) {
          case '/api/v1/quiz/current':
            return mockQuiz
          case `/api/v1/quiz/${mockQuiz.quizId}/user-responses`:
            return []
          default:
            throw Error('Undefined')
        }
      },
      httpPost: (url: string, body: object | undefined) => mockHttpPost(url, body)
    }))

    render(
      <CurrentUserContext.Provider
        value={{
          email: 'test@test.com',
          onLogin: () => {}
        }}
      >
        <QuizPage />
      </CurrentUserContext.Provider>
    )

    // Waits for the screen to load
    const quizPage = await screen.findByLabelText('quiz-page')

    // Checks the display of the quiz layout
    const quizLayout = await within(quizPage).findByTestId('quiz-layout')

    // Checks the title of the quiz
    const quizTitleComp = within(quizLayout).getByLabelText('quiz-layout-title')
    expect(quizTitleComp).toHaveTextContent(mockQuiz.title)

    // Checks the question of the quiz
    const quizQuestionComp = within(quizLayout).getByLabelText('quiz-question-responses-layout')
    const questionLabelComp = await within(quizQuestionComp).findByLabelText('question')
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[0].questionLabel)

    // Responses to select
    const responseToSelectQuestion1 = mockQuiz.questions[0].possibleResponses[1]
    const responseToSelectQuestion2 = mockQuiz.questions[1].possibleResponses[1]
    const responseToSelectQuestion3 = mockQuiz.questions[2].possibleResponses[3]
    const responseToSelectQuestion4 = mockQuiz.questions[3].possibleResponses[0]

    // Selects the response for question 1
    const responseQ1LabelComp = within(quizQuestionComp).getByLabelText(
      `radio-label-${responseToSelectQuestion1.responseId}`
    )
    await waitFor(() => userEvent.click(responseQ1LabelComp))

    // Go to question 2
    await waitFor(() => userEvent.click(screen.getByLabelText('btn-next')))

    // Selects the response for question 2
    const responseQ2LabelComp = within(quizQuestionComp).getByLabelText(
      `radio-label-${responseToSelectQuestion2.responseId}`
    )
    await waitFor(() => userEvent.click(responseQ2LabelComp))

    // Go to question 3
    await waitFor(() => userEvent.click(screen.getByLabelText('btn-next')))

    // Selects the response for question 3
    const responseQ3LabelComp = within(quizQuestionComp).getByLabelText(
      `radio-label-${responseToSelectQuestion3.responseId}`
    )
    await waitFor(() => userEvent.click(responseQ3LabelComp))

    // Go to question 4
    await waitFor(() => userEvent.click(screen.getByLabelText('btn-next')))

    // Selects the response for question 4
    const responseQ4LabelComp = within(quizQuestionComp).getByLabelText(
      `radio-label-${responseToSelectQuestion4.responseId}`
    )
    await waitFor(() => userEvent.click(responseQ4LabelComp))

    // Go to quiz resume
    await waitFor(() => userEvent.click(screen.getByLabelText('btn-next')))

    // Click on save
    await waitFor(() => userEvent.click(screen.getByLabelText('btn-save')))

    // Checks the mockHttpPost call on save
    expect(mockHttpPost).toHaveBeenCalledWith(Api.QuizApi.getUserResponses(mockQuiz.quizId), [
      {
        questionId: 1,
        responseId: responseToSelectQuestion1.responseId
      },
      {
        questionId: 2,
        responseId: responseToSelectQuestion2.responseId
      },
      {
        questionId: 3,
        responseId: responseToSelectQuestion3.responseId
      },
      {
        questionId: 4,
        responseId: responseToSelectQuestion4.responseId
      }
    ])
  })

  it('can remove a question when it depends on a non-selected response in the previous question', async () => {
    const mockHttpPost = jest.fn()
    mockUseHttp.mockImplementation(() => ({
      httpGet: (url: string) => {
        switch (url) {
          case '/api/v1/quiz/current':
            return mockQuiz
          case `/api/v1/quiz/${mockQuiz.quizId}/user-responses`:
            return []
          default:
            throw Error('Undefined')
        }
      },
      httpPost: (url: string, body: object | undefined) => mockHttpPost(url, body)
    }))

    render(
      <CurrentUserContext.Provider
        value={{
          email: 'test@test.com',
          onLogin: () => {}
        }}
      >
        <QuizPage />
      </CurrentUserContext.Provider>
    )

    // Waits for the screen to load
    const quizPage = await screen.findByLabelText('quiz-page')

    // Checks the display of the quiz layout
    const quizLayout = await within(quizPage).findByTestId('quiz-layout')

    // Checks the title of the quiz
    const quizTitleComp = within(quizLayout).getByLabelText('quiz-layout-title')
    expect(quizTitleComp).toHaveTextContent(mockQuiz.title)

    // Checks the question of the quiz
    const quizQuestionComp = within(quizLayout).getByLabelText('quiz-question-responses-layout')
    const questionLabelComp = await within(quizQuestionComp).findByLabelText('question')
    expect(questionLabelComp).toHaveTextContent(mockQuiz.questions[0].questionLabel)

    // Response to question 1
    const responseToSelectQuestion1 = mockQuiz.questions[0].possibleResponses[1]

    // Selects the response for question 1
    const responseQ1LabelComp = within(quizQuestionComp).getByLabelText(
      `radio-label-${responseToSelectQuestion1.responseId}`
    )
    await waitFor(() => userEvent.click(responseQ1LabelComp))

    // Go to question 2
    await waitFor(() => userEvent.click(screen.getByLabelText('btn-next')))

    // Response to question 2
    const responseToSelectQuestion2 = mockQuiz.questions[1].possibleResponses[1]

    // Selects the response for question 2
    const responseQ2LabelComp = within(quizQuestionComp).getByLabelText(
      `radio-label-${responseToSelectQuestion2.responseId}`
    )
    await waitFor(() => userEvent.click(responseQ2LabelComp))

    // Go to question 3
    await waitFor(() => userEvent.click(screen.getByLabelText('btn-next')))

    // Response to question 3
    const responseToSelectQuestion3 = mockQuiz.questions[2].possibleResponses[3]

    // Selects the response for question 3
    const responseQ3LabelComp = within(quizQuestionComp).getByLabelText(
      `radio-label-${responseToSelectQuestion3.responseId}`
    )
    await waitFor(() => userEvent.click(responseQ3LabelComp))

    // Go back to question 2
    await waitFor(() => userEvent.click(screen.getByLabelText('btn-previous')))

    // Change response to question 2
    const responseToSelectQuestion2Modified = mockQuiz.questions[1].possibleResponses[2]

    // Selects the response for question 2
    const responseQ2LabelCompModified = within(quizQuestionComp).getByLabelText(
      `radio-label-${responseToSelectQuestion2Modified.responseId}`
    )
    await waitFor(() => userEvent.click(responseQ2LabelCompModified))

    // Go to question 4 (the question 3 is not displayed because the condition on response for question 2 was NOT met)
    await waitFor(() => userEvent.click(screen.getByLabelText('btn-next')))

    // Response to question 3
    const responseToSelectQuestion4 = mockQuiz.questions[3].possibleResponses[0]

    // Selects the response for question 4
    const responseQ4LabelComp = within(quizQuestionComp).getByLabelText(
      `radio-label-${responseToSelectQuestion4.responseId}`
    )
    await waitFor(() => userEvent.click(responseQ4LabelComp))

    // Go to quiz resume
    await waitFor(() => userEvent.click(screen.getByLabelText('btn-next')))

    // Click on save
    await waitFor(() => userEvent.click(screen.getByLabelText('btn-save')))

    // Checks the mockHttpPost call on save
    expect(mockHttpPost).toHaveBeenCalledWith(Api.QuizApi.getUserResponses(mockQuiz.quizId), [
      {
        questionId: 1,
        responseId: responseToSelectQuestion1.responseId
      },
      {
        questionId: 2,
        responseId: responseToSelectQuestion2Modified.responseId
      },
      {
        questionId: 4,
        responseId: responseToSelectQuestion4.responseId
      }
    ])
  })
})
