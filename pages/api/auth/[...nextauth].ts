import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { Session } from 'next-auth'
import Providers from 'next-auth/providers'
import { connectToDB, folder, doc } from '../../../db'

const OBJ_DEFAULT_CONTENT = {
  time: 1556098174501,
  blocks: [
    {
      type: 'header',
      data: {
        text: 'Some default content',
        level: 2,
      },
    },
  ],
  version: '2.12.4',
}

type ExtendedSession = Session | Record<string, any>

/**
 *@description all authentication routes handler
 * @param {Object} req:NextApiRequest
 * @param {Object} res:NextApiResponse
 * @returns {undefined | Promise<undefined>} runs auth api
 */
export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, {
    session: {
      jwt: true,
    },

    jwt: {
      secret: process.env.JWT_SECRET,
    },

    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],

    database: process.env.DATABASE_URL,

    pages: {
      signIn: '/signin',
    },

    callbacks: {
      session: async (session: ExtendedSession, user) => {
        if (user) {
          session.user.id = user.id
        }
        return session
      },

      jwt: async (tokenPayload, user, account, profile, isNewUser) => {
        const { db } = await connectToDB()

        if (true === isNewUser) {
          const personalFolder = await folder.createFolder(db, { createdBy: `${user.id}`, name: 'Getting Started' })
          await doc.createDoc(db, {
            name: 'Start Here',
            folder: personalFolder._id,
            createdBy: `${user.id}`,
            content: {
              ...OBJ_DEFAULT_CONTENT,
            },
          })
        }

        if (tokenPayload && user) {
          return { ...tokenPayload, id: `${user.id}` }
        }

        return tokenPayload
      },
    },
  })
