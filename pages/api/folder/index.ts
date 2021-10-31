import { NextApiResponse } from 'next'
import nc from 'next-connect'
import { Request } from '../../../types'
import middleware from '../../../middleware/all'
import { folder } from '../../../db'
import onError from '../../../middleware/error'

const handler = nc<Request, NextApiResponse>({
  onError,
})

handler.use(middleware)

handler.post(async (req, res) => {
  const newFolder = await folder.createFolder(req.db, {
    ...req.body,
    createdBy: req.user.id,
  })

  res.send({ data: newFolder })
})

export default handler
