import { useEffect, useState } from 'react'

import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import { transparentize } from '@chakra-ui/theme-tools'

import theme from 'theme'

const zeroRemainingTime = {
  dd: 0,
  hh: 0,
  mm: 0,
  ss: 0
}

export default function Countdown({ until, ...rest }) {
  const [isPassed, setIsPassed] = useState(null)
  const [remainingTime, setRemainingTime] = useState(zeroRemainingTime)

  useEffect(() => {
    if (isPassed) return

    const interval = setInterval(() => {
      const newRemainingTime = until - new Date().getTime()

      if (newRemainingTime < 0) {
        setRemainingTime(zeroRemainingTime)
        setIsPassed(true)
        return
      }

      setRemainingTime({
        dd: String(
          Math.floor(newRemainingTime / (1000 * 60 * 60 * 24))
        ).padStart(2, '0'),
        hh: String(
          Math.floor(
            (newRemainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          )
        ).padStart(2, '0'),
        mm: String(
          Math.floor((newRemainingTime % (1000 * 60 * 60)) / (1000 * 60))
        ).padStart(2, '0'),
        ss: String(
          Math.floor((newRemainingTime % (1000 * 60)) / 1000)
        ).padStart(2, '0')
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [until, isPassed])

  return (
    <Box {...rest}>
      <Box
        px={6}
        py={3}
        borderRadius='lg'
        bg={transparentize('gray.500', 0.1)(theme)}
        borderWidth={2}
        borderColor='gray.500'
      >
        <Grid
          templateColumns='1fr 1ch 1fr 1ch 1fr 1ch 1fr'
          gap={4}
        >
          <GridItem>
            <Box textAlign='center'>
              <Text
                as='span'
                display='block'
                fontSize='2xl'
                fontWeight='bold'
              >
                {remainingTime.dd}
              </Text>

              <Text
                as='span'
                display='block'
                fontSize='sm'
              >
                Days
              </Text>
            </Box>
          </GridItem>

          <GridItem>:</GridItem>

          <GridItem>
            <Box textAlign='center'>
              <Text
                as='span'
                display='block'
                fontSize='2xl'
                fontWeight='bold'
              >
                {remainingTime.hh}
              </Text>
              <Text
                as='span'
                display='block'
                fontSize='sm'
              >
                Hours
              </Text>
            </Box>
          </GridItem>
          <GridItem>:</GridItem>
          <GridItem>
            <Box textAlign='center'>
              <Text
                as='span'
                display='block'
                fontSize='2xl'
                fontWeight='bold'
              >
                {remainingTime.mm}
              </Text>
              <Text
                as='span'
                display='block'
                fontSize='sm'
              >
                Minutes
              </Text>
            </Box>
          </GridItem>
          <GridItem>:</GridItem>
          <GridItem>
            <Box textAlign='center'>
              <Text
                as='span'
                display='block'
                fontSize='2xl'
                fontWeight='bold'
              >
                {remainingTime.ss}
              </Text>
              <Text
                as='span'
                display='block'
                fontSize='sm'
              >
                Seconds
              </Text>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  )
}
