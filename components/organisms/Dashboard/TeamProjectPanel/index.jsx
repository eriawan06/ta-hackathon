import { Button, Heading, Text } from '@chakra-ui/react'

import Card from 'components/atoms/Card'

import { useRouter } from 'next/router'

import { useProject } from 'hooks/swr/project'

import { useFormToast } from 'hooks/form-toast'

export default function TeamProjectPanel({ event, team, participant }) {
  const router = useRouter()
  const { data: projectDetail } = useProject(team.project_id)
  const toast = useFormToast('checker-team')

  const checker = () => {
    if (team.num_of_member < event.team_min_member) {
      toast.send("error", "Can't create project.", `Minimum member is ${event.team_min_member}`)
      return
    }
    
    if (!projectDetail && participant.id !== team.participant_id) {
      toast.send("error", "Can't create project.", "Only team's leader/admin can create project")
      return
    }

    router.push('/dashboard/create-project')
  }

  return (
    <Card
      variant='solid'
      layerStyle='dashboardCard'
      position='relative'
      w='full'
      p={8}
    >
      <Heading as='h3' fontSize='2xl' mb='35px'>Team's Project</Heading>
      <Text mb='22px'>
        {projectDetail
          ? 'Your team has a project'
          : 'Start your project to begin your submission.'}
      </Text>
      <Button
        variant='solid'
        size='lg'
        colorScheme='red'
        w='full'
        fontSize='base'
        onClick={checker}
      >
        {projectDetail ? 'Edit Project' : 'Create Project'}
      </Button>
    </Card>
  )
}
