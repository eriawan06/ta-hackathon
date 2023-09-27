import { Box, Card, Center, Heading } from '@chakra-ui/react'

import DashboardLayout from 'layouts/DashboardLayout'
import Seo from 'components/atoms/Seo'

import { siteTitle } from 'config'

RegistrationClosedPage.getLayout = (page) => {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default function RegistrationClosedPage() {
  return (
    <>
      <Seo title={`Registration Closed | ${siteTitle}`} />

      <Box mb={10} my={20}>
        <Center>
          <Card
            variant='solid'
            layerStyle='dashboardCard'
            w='50%'
            p={8}
          >
            <Center>
              <Heading as='h1' fontSize={{ base: '3xl', lg: '3xl' }}>
                Registration is Closed
              </Heading>
            </Center>
          </Card>
        </Center>
      </Box>
    </>
  )
}
