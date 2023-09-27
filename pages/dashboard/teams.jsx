import { useEffect, useState } from 'react'

import Card from 'components/atoms/Card'

import DashboardMainLayout from 'layouts/DashboardMainLayout'
import ListTeam from 'components/organisms/Dashboard/TeamPanel/ListTeam'
import DetailTeam from 'components/organisms/Dashboard/TeamPanel/DetailTeam'
import { useMyTeam } from 'hooks/swr/teams'
import MyTeam from 'components/organisms/Dashboard/TeamPanel/MyTeam'
import ListInvitation from 'components/organisms/Dashboard/TeamPanel/ListInvitation'
import { useLatestEvents } from 'hooks/swr/events'
import { useParticipantProfile } from 'hooks/swr/users'

export default function TeamsPanel() {
  const [step, setStep] = useState() // list, detail, invitation, my-team
  const [selectedTeam, setSelectedTeam] = useState(null)

  const { data: latestEvent, isLoading: isLatestEventLoading } = useLatestEvents()
  const { data: myTeam, isLoading, error } = useMyTeam()
  const { data: participantProfile, isLoading: isParticipantProfileLoading } = useParticipantProfile()

  useEffect(() => {
    if (isLoading) return

    if (!error && myTeam) {
      setStep('my-team')
      return
    }

    setStep('list')
  }, [])

  const handleOpenInvitations = () => {
    setSelectedTeam()
    setStep('invitation')
  }

  const handleOpenDetail = (teamId) => {
    setSelectedTeam(teamId)
    setStep('detail')
  }

  const handleOnBack = () => {
    setSelectedTeam(null)
    setStep('list')
  }

  return (
    <>
      <DashboardMainLayout
        isShowTeamProject={step === 'my-team'}
        event={latestEvent}
        team={myTeam}
        participant={participantProfile}
        pageTitle='Teams'
      >
        {step !== 'my-team' && (
          <Card
            variant='solid'
            layerStyle='dashboardCard'
            w='full'
            p={8}
            overflow='hidden'
            maxHeight='700px'
          >
            {step === 'list' &&
              <ListTeam
                latestEvent={latestEvent}
                isLatestEventLoading={isLatestEventLoading}
                openDetail={handleOpenDetail}
                openInvitation={handleOpenInvitations}
              />
            }
            {step === 'detail' && (
              <DetailTeam
                id={selectedTeam}
                latestEvent={latestEvent}
                isLatestEventLoading={isLatestEventLoading}
                onBack={handleOnBack}
              />
            )}
            {step === 'invitation' &&
              <ListInvitation
                latestEvent={latestEvent}
                isLatestEventLoading={isLatestEventLoading}
                onBack={handleOnBack}
              />
            }
          </Card>
        )}
        {step === 'my-team' &&
          <MyTeam
            latestEvent={latestEvent}
            isLatestEventLoading={isLatestEventLoading}
            participantProfile={participantProfile}
            isParticipantProfileLoading={isParticipantProfileLoading}
            team={myTeam}
          />
        }
      </DashboardMainLayout>
    </>
  )
}
