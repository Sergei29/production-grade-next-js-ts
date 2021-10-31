import { NextApiResponse } from 'next'
import nc from 'next-connect'
import { Request } from '../../../types'
import middleware from '../../../middleware/all'
import { doc } from '../../../db'
import onError from '../../../middleware/error'

const handler = nc<Request, NextApiResponse>({ onError })

handler.use(middleware)

handler.put(async (req, res) => {
  const updatedDoc = await doc.updateOne(req.db, req.query.id as string, req.body)
  res.send({ data: updatedDoc })
})

export default handler
