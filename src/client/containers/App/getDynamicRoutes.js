import AsyncComponent from 'utils/async-component'

import NotFoundPage from 'pages/NotFound'
import HomePage from 'pages/HomePage'

const AboutPage = AsyncComponent(() =>
  import(/* webpackChunkName: 'AboutPage' */ 'pages/AboutPage')
)

const ContactPage = AsyncComponent(() =>
  import(/* webpackChunkName: 'ContactPage' */ 'pages/ContactPage')
)

const FacebookPage = AsyncComponent(() =>
  import(/* webpackChunkName: 'FacebookPage' */ 'pages/FacebookPage')
)

const MusicPage = AsyncComponent(() =>
  import(/* webpackChunkName: 'MusicPage'  */ 'pages/MusicPage')
)

// Pass location to switch component, so history updates don't block app from re-rendering
export default function Pages(location, auth) {
  return {
    NotFoundPage,
    HomePage,
    AboutPage,
    ContactPage,
    FacebookPage,
    MusicPage
  }
}
