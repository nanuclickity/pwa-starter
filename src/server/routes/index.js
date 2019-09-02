import { Router } from 'express'
import { getTemplateData } from '../renderer/render-template' // eslint-disable-line no-unused-vars

const router = Router()

/**
 * [getRouter Returns main router for application]
 * @param  {object} app     [express.js app object]
 * @return {object} router  [express.js router with bound routes]
 */
export default function getRouter(app) {
  // Health check
  router.get('/ping', (req, res) => res.status(200).send('pong'))

  // No server rendering
  router.get('*', handleStaticFiles, (req, res) => {
    res.render('index', getTemplateData(req))
  })

  // Server rendering
  // router.get(
  //   '*',
  //   handleStaticFiles,
  //   handleAppShellRequest,
  //   require('../renderer').StreamingRenderer
  // )

  return router
}
