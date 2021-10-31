import { connectToDB } from '../db/connect'
import { NextApiRequest, NextApiResponse } from 'next'

declare global {
  namespace NodeJS {
    interface Global {
      mongo: any
    }
  }
}

type Request = NextApiRequest & Record<string, any>

/**
 * @description middleware attaching the connected DB to request object
 * @param {Object} req request
 * @param {Object} res response
 * @param {Function} next fall through to next route handler
 * @returns {Promise<undefined>}
 */
const database = async (req: Request, res: NextApiResponse, next) => {
  const { db, dbClient } = await connectToDB()
  req.db = db
  req.dbClient = dbClient

  next()
}

export default database
