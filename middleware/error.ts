export default async function onError(error, req, res, next) {
  /**
   * @description this is where you can send you error reports to `Sentry` or
   * do other error handling for api level
   */
  console.log(error)
  res.status(500).end()
}
