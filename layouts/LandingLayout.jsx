import { Box } from '@chakra-ui/react'

import Navbar from 'components/molecules/Navbar'
import Footer from 'components/organisms/Footer'

const navbarLinks = [
  {
    text: 'Event',
    href: '/#event'
  },
  {
    text: 'Activity',
    href: '/#activity'
  },
  {
    text: 'Partner',
    href: '/#partner'
  }
]

const navbarButtons = [
  {
    text: 'Login',
    href: '/auth/login'
  }
]

export default function LandingTemplate({ children }) {
  return (
    <Box pt={16}>
      <Navbar
        links={navbarLinks}
        buttons={navbarButtons}
      />

      {children}
      <Footer />
    </Box>
  )
}
