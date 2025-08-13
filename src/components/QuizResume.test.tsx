import { render, screen, within } from '@testing-library/react'
import QuizResume from './QuizResume'
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

describe('The QuizResume component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders well (and includes the optional question)', async () => {
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

    render(<QuizResume quiz={mockQuiz} userResponses={mockUserResponses} />)

    const quizResumeComp = await screen.findByLabelText('quiz-resume')
    const questionItems = within(quizResumeComp).getAllByLabelText('item-text')
    expect(questionItems).toHaveLength(4)
    expect(questionItems[0]).toHaveTextContent(mockQuiz.questions[0].questionLabel)

    // Checks response to question 1
    const response1: string | undefined = mockQuiz.questions[0].possibleResponses.find(
      (resp) => resp.responseId === mockUserResponses[0].responseId
    )?.responseLabel
    expect(questionItems[0]).toHaveTextContent(response1!)

    // Checks response to question 2
    const response2: string | undefined = mockQuiz.questions[1].possibleResponses.find(
      (resp) => resp.responseId === mockUserResponses[1].responseId
    )?.responseLabel
    expect(questionItems[1]).toHaveTextContent(response2!)

    // Checks response to question 3
    const response3: string | undefined = mockQuiz.questions[2].possibleResponses.find(
      (resp) => resp.responseId === mockUserResponses[2].responseId
    )?.responseLabel
    expect(questionItems[2]).toHaveTextContent(response3!)

    // Checks response to question 4
    const response4: string | undefined = mockQuiz.questions[3].possibleResponses.find(
      (resp) => resp.responseId === mockUserResponses[3].responseId
    )?.responseLabel
    expect(questionItems[3]).toHaveTextContent(response4!)
  })

  it('renders well (and DOES NOT includes the optional question)', async () => {
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
        questionId: 4,
        responseId: 31
      }
    ]

    render(<QuizResume quiz={mockQuiz} userResponses={mockUserResponses} />)

    const quizResumeComp = await screen.findByLabelText('quiz-resume')
    const questionItems = within(quizResumeComp).getAllByLabelText('item-text')
    expect(questionItems).toHaveLength(3)
    expect(questionItems[0]).toHaveTextContent(mockQuiz.questions[0].questionLabel)

    // Checks response to question 1
    const response1: string | undefined = mockQuiz.questions[0].possibleResponses.find(
      (resp) => resp.responseId === mockUserResponses[0].responseId
    )?.responseLabel
    expect(questionItems[0]).toHaveTextContent(response1!)

    // Checks response to question 2
    const response2: string | undefined = mockQuiz.questions[1].possibleResponses.find(
      (resp) => resp.responseId === mockUserResponses[1].responseId
    )?.responseLabel
    expect(questionItems[1]).toHaveTextContent(response2!)

    // Checks response to question 4 (because question 3 is not displayed (condition to display question 3 NOT matched))
    const response3: string | undefined = mockQuiz.questions[3].possibleResponses.find(
      (resp) => resp.responseId === mockUserResponses[2].responseId
    )?.responseLabel
    expect(questionItems[2]).toHaveTextContent(response3!)
  })
})
