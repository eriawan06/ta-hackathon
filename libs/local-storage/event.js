import { ENDPOINT_HOME, getHomeData } from 'services/home'

export function setLatestEvent(data) {
  localStorage.setItem('latest_event', JSON.stringify(data))
}

export async function getLatestEvent() {
  let event = localStorage.getItem('latest_event')
  if (event === '' || event === undefined || event === null) {
    const res = await getHomeData(ENDPOINT_HOME)
    if (res && res.status === 200) {
      event = res.data.data
      setLatestEvent(event)
    }
  } else {
    event = JSON.parse(event)
  }
  return event
}

export function clearLatestEvent() {
  return localStorage.removeItem('latest_event')
}

export async function getRegistrationTimeline() {
  const event = await getLatestEvent()
  let registTimeline = null
  event.event_timelines.forEach((timeline) => {
    if (timeline.title.toLowerCase() === 'registration') {
      registTimeline = timeline
    }
  })
  return registTimeline
}
