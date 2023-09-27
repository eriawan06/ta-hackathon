import { Button, Heading, Text, Tooltip } from '@chakra-ui/react'

import { useRouter } from 'next/router'

import Card from 'components/atoms/Card'

export default function MyProjectPanel() {
  const router = useRouter()
  return (
    <Card
      variant='solid'
      layerStyle='dashboardCard'
      w='full'
      p={8}
    >
      <Heading
        as='h3'
        mb={8}
        fontSize='2xl'
      >
        My Project
      </Heading>

      <Text
        as='p'
        mb={2}
      >
        Start your project to begin your submission and invite teammates.
      </Text>

      <Tooltip
        hasArrow
        bg='black'
        color='white'
        label='Go to project page to create a new project.'
      >
        <Button
          colorScheme='red'
          w='full'
          onClick={() => router.push('/dashboard/project')}
        >
          Create Project
        </Button>
      </Tooltip>
    </Card>
  )
}
