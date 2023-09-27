import { useRouter } from 'next/router'

import { motion, AnimatePresence } from 'framer-motion'

import Seo from 'components/atoms/Seo'

import DashboardLayout from 'layouts/DashboardLayout'

import { siteTitle } from 'config'

const pageTransitionVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
}

export default function DashboardProjectLayout({
  children,
  pageTitle = 'Dashboard'
}) {
  const { asPath } = useRouter()

  return (
    <>
      <Seo title={`${pageTitle} | ${siteTitle}`} />

      <DashboardLayout>
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
      </DashboardLayout>
    </>
  )
}
