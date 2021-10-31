import { Db } from 'mongodb'
import { Collection } from '../types'

/**
 * @param {Object} db MongoDB object
 * @param {String} id user ID
 * @returns {Promise<Object>} a promise resolving to user's object
 */
export const getUserById = async (db: Db, id: string): Promise<Record<string, any>> => {
  return db.collection(Collection.USERS).findOne({ _id: id })
}
