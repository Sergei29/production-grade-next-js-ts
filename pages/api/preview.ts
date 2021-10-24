import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @description preview route handler
 * @param {Object} req:NextApiRequest
 * @param {Object} res:NextApiResponse
 * @returns {undefined}
 */
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.setPreviewData({})
  res.redirect(req.query.route as string)
}

export default handler
