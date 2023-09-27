import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { Button, Grid, GridItem, VStack, Card } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

import Seo from 'components/atoms/Seo'
import ProfilePanel from 'components/organisms/Dashboard/ProfilePanel'
import TeamProjectPanel from 'components/organisms/Dashboard/TeamProjectPanel'

import DashboardLayout from 'layouts/DashboardLayout'

import { siteTitle } from 'config'

const dashboardRoutes = [
  {
    title: 'Payment',
    slug: 'payment'
  },
  {
    title: 'Schedule',
    slug: 'schedule'
  },
  {
    title: 'Teams',
    slug: 'teams'
  },
  {
    title: 'Rules',
    slug: 'rules'
  }
]

const pageTransitionVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
}

export default function DashboardMainLayout({
  children,
  pageTitle = 'Dashboard',
  isShowNavbar = true,
  isShowTeamProject = false,
  ...props
}) {
  const { asPath } = useRouter()
  // const { data: myTeam } = useMyTeam()
  // const { data: latestEvent } = useLatestEvents()

  return (
    <>
      <Seo title={`${pageTitle} | ${siteTitle}`} />

      <DashboardLayout>
        <Grid
          templateColumns={{ base: '1fr', lg: '32ch 1fr' }}
          gap={8}
        >
          <GridItem>
            <VStack
              spacing={8}
              align='start'
              w='full'
            >
              <ProfilePanel />
              {isShowTeamProject && props.event && props.team && props.participant &&
                <TeamProjectPanel event={props.event} team={props.team} participant={props.participant} />
              }
            </VStack>
          </GridItem>

          <GridItem>
            <VStack
              spacing={8}
              align='stretch'
              w='full'
            >
              {isShowNavbar && (
                <Card
                  variant='solid'
                  layerStyle='dashboardCard'
                  w='full'
                  py={3}
                >
                  <Grid
                    templateColumns={{
                      base: 'repeat(2, 1fr)',
                      lg: 'repeat(4, 1fr)'
                    }}
                    gap={8}
                  >
                    {dashboardRoutes.map((route) => (
                      <GridItem key={`dashboard-link-${route.slug}`}>
                        <NextLink
                          href={`/dashboard/${route.slug}`}
                          passHref
                        >
                          <Button
                            as='a'
                            variant='ghost'
                            colorScheme='red'
                            isActive={`/dashboard/${route.slug}` === asPath}
                            w='full'
                          >
                            {route.title}
                          </Button>
                        </NextLink>
                      </GridItem>
                    ))}
                  </Grid>
                </Card>
              )}

              <AnimatePresence exitBeforeEnter>
                <motion.div
                  key={`dashboard-panel-path-${asPath}`}
                  variants={pageTransitionVariants}
                  initial='hidden'
                  animate='visible'
                  exit='hidden'
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </VStack>
          </GridItem>
        </Grid>
      </DashboardLayout>
    </>
  )
}
