import { googleOauthClientID, googleOauthRedirect } from 'config'

export const getGoogleOauthUrl = () => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`

  const options = {
    redirect_uri: googleOauthRedirect,
    client_id: googleOauthClientID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' '),
    state: '71dc3accb7ebcab8a322d85d88b0a6ae123a4ed6a788ea6d'
  }

  const qs = new URLSearchParams(options)
  return `${rootUrl}?${qs.toString()}`
}
