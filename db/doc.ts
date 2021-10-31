import { Db } from 'mongodb'
import { nanoid } from 'nanoid'
import { Collection } from '../types'

type DocType = { createdBy: string; folder: string; name: string; content?: any }

/**
 * @param {Object} db MongoDB object
 * @param {String} id doc ID
 * @returns {Promise<Object>} a promise resolving to document object
 */
export const getOneDoc = async (db: Db, id: string): Promise<Record<string, any>> => {
  return db.collection(Collection.DOCS).findOne({
    _id: id,
  })
}

/**
 * @param {Object} db MongoDB object
 * @param {String} folderId folder ID
 * @returns {Promise<Array>} a promise resolving to list of folders from DB related to folder's ID
 */
export const getDocsByFolder = async (db: Db, folderId: string): Promise<Record<string, any>[]> => {
  return db.collection(Collection.DOCS).find({ folder: folderId }).toArray()
}

/**
 * @param {Object} db MongoDB object
 * @param {Object} doc new doc data
 * @returns {Promise<Object>} a promise resolving to newly created document
 */
export const createDoc = async (db: Db, doc: DocType): Promise<Record<string, any>> => {
  return db
    .collection(Collection.DOCS)
    .insertOne({
      _id: nanoid(12),
      ...doc,
      createdAt: new Date().toDateString(),
    })
    .then(({ ops }) => ops[0])
}

/**
 * @param {Object} db MongoDB object
 * @param {String} id doc ID
 * @param {Object} updates updated doc data
 * @returns {Promise<Object>} a promise resolving to an updated document
 */
export const updateOne = async (db: Db, id: string, updates: any): Promise<Record<string, any>> => {
  const operation = await db.collection(Collection.DOCS).updateOne(
    {
      _id: id,
    },
    { $set: updates },
  )

  if (!operation.result.ok) {
    throw new Error('Could not update document')
  }

  const updated = await db.collection(Collection.DOCS).findOne({ _id: id })
  return updated
}
