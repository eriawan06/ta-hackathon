import { useRouter } from 'next/router'

import { Grid, GridItem, VStack, Heading } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

import Seo from 'components/atoms/Seo'
import FilterPanel from 'components/organisms/Dashboard/FilterPanel'

import DashboardLayout from 'layouts/DashboardLayout'

import { siteTitle } from 'config'

const pageTransitionVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
}

export default function DashboardSearchParticipant({
  children,
  pageTitle = 'Dashboard',
  sort,
  setSort,
  search,
  setSearch,
}) {
  const { asPath } = useRouter()

  return (
    <>
      <Seo title={`${pageTitle} | ${siteTitle}`} />

      <DashboardLayout>
        <Grid templateColumns={{ base: '1fr', lg: '32ch 1fr' }} gap={8}>
          <GridItem>
            <VStack mt='60px' spacing={8} align='start' w='full'>
              <FilterPanel 
                sort={sort}
                setSort={setSort}
                search={search} 
                setSearch={setSearch} 
              />
            </VStack>
          </GridItem>

          <GridItem>
            <VStack spacing={8} align='stretch' w='full'>
              <Heading as='h3' fontSize='2xl'>
                Search Participant
              </Heading>
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
