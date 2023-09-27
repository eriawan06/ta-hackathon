export const siteTitle = 'Hackathon by Sagara Technology'

export const tokenStorageKey = 'hsa2022-auth'

export const baseServiceLocal = 'http://localhost:3002/api/v1'
export const baseServiceURLDEV = 'http://103.176.79.242:21061/api/v1'
export const baseServiceURLDEV2 = 'http://sagarahackathon.my.id:21061/api/v1'
export const baseServiceURLPROD =
  'https://api.hackathon.sagaratechnology.com/api/v1'
export const baseServiceURL = baseServiceURLDEV2

export const homeServiceURL =
  process.env.NEXT_PUBLIC_HOME_SERVICE_URL ?? `${baseServiceURL}/home/` + ''
export const authServiceURL =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ?? `${baseServiceURL}/auth` + ''
export const usersServiceURL =
  process.env.NEXT_PUBLIC_USERS_SERVICE_URL ?? `${baseServiceURL}/users` + ''
export const eventsServiceURL =
  process.env.NEXT_PUBLIC_EVENTS_SERVICE_URL ?? `${baseServiceURL}/events` + ''
export const scheduleServiceURL =
  process.env.NEXT_PUBLIC_SCHEDULE_SERVICE_URL ??
  `${baseServiceURL}/schedules` + ''
export const teamServiceURL =
  process.env.NEXT_PUBLIC_TEAM_SERVICE_URL ?? `${baseServiceURL}/teams` + ''
export const referencesServiceURL =
  process.env.NEXT_PUBLIC_REFERENCES_SERVICE_URL ?? `${baseServiceURL}` + ''
export const paymentsServiceURL =
  process.env.NEXT_PUBLIC_PAYMENTS_SERVICE_URL ?? `${baseServiceURL}` + ''
export const uploadServiceURL =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ?? `${baseServiceURL}/upload/`
export const regionServiceURL =
  process.env.NEXT_PUBLIC_REGION_SERVICE_URL ?? `${baseServiceURL}/region` + ''
export const ProjectsServiceURL =
  process.env.NEXT_PUBLIC_REGION_SERVICE_URL ?? `${baseServiceURL}/projects` + ''

export const googleOauthClientID =
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ?? '1025492026392-uno3spcc04et1rfos2vmkl4thhiamcb3.apps.googleusercontent.com' 
export const googleOauthClientSecret =
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET ?? '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'
export const googleOauthRedirect = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT ?? 'http://sagarahackathon.my.id:21061/api/v1/auth/google/callback'
