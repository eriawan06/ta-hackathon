import NextLink from 'next/link'

import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Image,
  Link,
  Spacer
} from '@chakra-ui/react'
import { useState } from 'react'

import { useSWRConfig } from 'swr'

export default function Navbar({ logoHref = '/', links, buttons }) {
  const { cache } = useSWRConfig()
  const [isBtnLoading, setIsBtnLoading] = useState(false)

  return (
    <Container
      as={Flex}
      variant='spacedX'
      position='fixed'
      insetX={0}
      top={0}
      zIndex={2000}
      alignItems='center'
      gap={8}
      w='full'
      py={3}
      bg='richBlack'
    >
      <Box display={{ base: 'none', lg: 'block' }}>
        <NextLink
          href={logoHref}
          passHref
        >
          <Link
            as='a'
            display='block'
          >
            <Image
              src='/images/logo/sagara-logo-red.png'
              alt='Sagara Logo'
              h={8}
            />
          </Link>
        </NextLink>
      </Box>

      <Spacer />

      <HStack>
        {links &&
          links.map((link, i) => {
            const { href, text } = link

            return (
              <NextLink
                key={`navbar-link-${i}`}
                href={href}
                passHref
              >
                <Button
                  as='a'
                  variant='ghost'
                  colorScheme='red'
                >
                  {text}
                </Button>
              </NextLink>
            )
          })}

        {buttons &&
          buttons.map((button, i) => {
            const { text, href, ...rest } = button

            const ButtonWrapper = href
              ? ({ children }) => (
                  <NextLink
                    href={href}
                    passHref
                  >
                    {children}
                  </NextLink>
                )
              : ({ children }) => children

            return (
              <ButtonWrapper key={`navbar-button-${i}`}>
                <Button
                  as={href ? 'a' : 'button'}
                  variant='solid'
                  colorScheme='red'
                  isLoading={isBtnLoading}
                  onClick={() => {
                    setIsBtnLoading(true)
                    if (href === '/auth/logout') {
                      console.log('reset cache');
                      cache.clear()
                    }
                  }}
                  {...rest}
                >
                  {text}
                </Button>
              </ButtonWrapper>
            )
          })}
      </HStack>
    </Container>
  )
}
