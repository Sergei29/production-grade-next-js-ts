import { Db } from 'mongodb'
import { nanoid } from 'nanoid'
import { Collection } from '../types'

type FolderType = { createdBy: string; name: string }

/**
 * @param {Object} db MongoDB object
 * @param {Object} folder new folder data
 * @returns {Promise<Object>} a promise resolving to newly created folder
 */
export const createFolder = async (db: Db, folder: FolderType) => {
  const newFolder: Record<string, any> = await db
    .collection(Collection.FOLDERS)
    .insertOne({
      _id: nanoid(),
      ...folder,
      createdAt: new Date().toDateString(),
    })
    .then(({ ops }) => ops[0])

  return newFolder
}

/**
 * @param {Object} db MongoDB object
 * @param {String} userId user ID
 * @returns {Promise<Array>} a promise resolving to list of folders from DB related to user's ID
 */
export const getFolders = async (db: Db, userId: string): Promise<Record<string, any>[]> => {
  return await db.collection(Collection.FOLDERS).find({ createdBy: userId }).toArray()
}
