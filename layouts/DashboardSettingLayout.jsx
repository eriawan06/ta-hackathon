import NextLink from 'next/link'

import { Button, Grid, GridItem, VStack } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

import Card from 'components/atoms/Card'

import DashboardLayout from 'layouts/DashboardLayout'

import { useRouter } from 'next/router'

const pageTransitionVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
}

const settingRoutes = [
  {
    title: 'Profile & Location',
    slug: 'profile'
  },
  {
    title: 'Education',
    slug: 'education'
  },
  {
    title: 'Experience & Preference',
    slug: 'preference'
  },
  {
    title: 'Account & Privacy',
    slug: 'account'
  },
  {
    title: 'Change Password',
    slug: 'change-password'
  }
]

export default function DashboardSettingLayout({ children }) {
  const { asPath } = useRouter()

  return (
    <DashboardLayout>
      <Grid
        templateColumns={{ base: '1fr', lg: '32ch 1fr' }}
        gap={4}
        h='100%'
      >
        <GridItem>
          <Card
            variant='solid' bg='red.700' w='90%' h='100%' py={8}
          >
            <VStack align='stretch' spacing={4} w='full'>
              {settingRoutes.map((setting) => (
                <NextLink
                  key={`setting-nav-to-${setting.slug}`}
                  href={`/dashboard/setting/${setting.slug}`}
                  passHref
                >
                  <Button
                    variant='ghost'
                    colorScheme='black'
                    borderRadius='0'
                    justifyContent='end'
                    isActive={`/dashboard/setting/${setting.slug}` === asPath}
                  >
                    {setting.title}
                  </Button>
                </NextLink>
              ))}
            </VStack>
          </Card>
        </GridItem>

        <GridItem>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={`dashboard-setting-panel-${asPath}`}
              variants={pageTransitionVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </GridItem>
      </Grid>
    </DashboardLayout>
  )
}
