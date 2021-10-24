import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @description clearing preview route handler
 * @param {Object} req:NextApiRequest
 * @param {Object} res:NextApiResponse
 * @returns {undefined}
 */
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.clearPreviewData()
  // res.end('Preview mode disabled')
  res.redirect('/')
}

export default handler
