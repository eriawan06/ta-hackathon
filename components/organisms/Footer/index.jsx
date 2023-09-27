import NextLink from 'next/link'

import {
  Box,
  Container,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Text
} from '@chakra-ui/react'
import { BsLinkedin, BsFacebook, BsYoutube } from 'react-icons/bs'

const socialLinks = [
  {
    icon: BsYoutube,
    href: 'https://www.youtube.com/channel/UCEgphDbJ89XiszXoPqyJTXg/'
  },
  {
    icon: BsLinkedin,
    href: 'https://www.linkedin.com/company/sagara-asia'
  },
  {
    icon: BsFacebook,
    href: 'https://www.facebook.com/Sagaratechnology'
  }
]

export default function Footer() {
  return (
    <Container
      as='footer'
      variant='spacedX'
      py={12}
    >
      <Grid
        templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
        gap={12}
      >
        <GridItem>
          <Image
            src='/images/logo/sagara-logo-white.png'
            alt='sagara logo'
            maxW='min(36ch, 60%)'
            mx={{ base: 'auto', lg: '0' }}
          />
        </GridItem>

        <GridItem>
          <HStack
            justify={{ base: 'center', lg: 'end' }}
            spacing={6}
            w='full'
          >
            {socialLinks.map((link, i) => (
              <NextLink
                key={`footer-social-link-${i}`}
                href={link.href}
                rel='noreferrer noopener'
                passHref
              >
                <IconButton
                  as='a'
                  icon={
                    <Icon
                      as={link.icon}
                      fontSize='2xl'
                    />
                  }
                  variant='ghost'
                  size='sm'
                  cursor='pointer'
                />
              </NextLink>
            ))}
          </HStack>
        </GridItem>

        <GridItem>
          <HStack
            spacing='6'
            justify={{ base: 'center', lg: 'start' }}
          >
            <Link>Schedule</Link>
            <NextLink
              href='/auth/register'
              passHref
            >
              <Link>Register</Link>
            </NextLink>
            <Link>Contact WhatsApp</Link>
          </HStack>
        </GridItem>

        <GridItem>
          <Box textAlign={{ base: 'center', lg: 'right' }}>
            <Text as='p'>&copy; 2023 - Sagara Technology</Text>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  )
}
