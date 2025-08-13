import type { Quiz } from '../types'

export const dummyQuiz: Quiz = {
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
