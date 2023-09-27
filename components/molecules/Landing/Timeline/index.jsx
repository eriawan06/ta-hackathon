import {
  Box,
  Heading,
  Flex,
  List,
  ListItem,
  Text,
  VStack
} from '@chakra-ui/react'

import Card from 'components/atoms/Card'

import theme from 'theme'

const getDateWithOrdinal = (date) => {
  let ordinal = 'th'

  switch (date.getDate()) {
    case 1:
    case 21:
    case 31:
      ordinal = 'st'
      break
    case 2:
    case 22:
      ordinal = 'nd'
      break
    case 3:
    case 23:
      ordinal = 'rd'
      break
  }

  return `${date.getDate()}${ordinal}`
}

const getShortMonth = (date) => {
  return date.toLocaleString('en', { month: 'short' })
}

export default function Timeline({ items }) {
  return (
    <Box
      overflowX='scroll'
      overflowY='visible'
      pt={2}
      pb={8}
      sx={{
        '&': {
          scrollbarColor: `${theme.colors.red[500]} ${theme.colors.gray[800]}`
        },
        '&::-webkit-scrollbar': {
          width: 2,
          height: 2
        },
        '&::-webkit-scrollbar-track': {
          background: 'gray.800',
          borderRadius: 'full'
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'red',
          borderRadius: 'full'
        }
      }}
    >
      <Flex
        wrap='nowrap'
        gap='8'
      >
        {items.map((item, i) => {
          const startDate = new Date(item.start_date)
          let endDate = null
          if (item.start_date !== item.end_date) {
            endDate = new Date(item.end_date)
          }

          return (
            <Card
              key={`timeline-item-${i}`}
              variant='gradient'
              isHoverable
              flexShrink='0'
              flexGrow='0'
              w='20ch'
              pb={8}
            >
              <Box
                p={4}
                borderBottom={4}
                borderBottomColor='red'
                borderBottomStyle='solid'
                h='100%'
              >
                <VStack
                  justify='end'
                  align='start'
                  spacing={8}
                  h='100%'
                >
                  <List as={List}>
                    <ListItem key='1'>
                      {item.title}
                    </ListItem>
                  </List>
                  
                  {endDate == null ? (
                    <Heading
                      as='h3'
                      fontSize='4xl'
                      color='red'
                    >
                      <Text
                        as='span'
                        display='block'
                      >
                        {getShortMonth(startDate)}
                      </Text>
                      <Text
                        as='span'
                        display='block'
                      >
                        {getDateWithOrdinal(startDate)}
                      </Text>
                    </Heading>
                    ) : (
                    <Heading
                      as='h3'
                      fontSize='3xl'
                      color='red'
                    >
                      <Text
                        as='span'
                        display='block'
                      >
                        {getShortMonth(startDate)} {getDateWithOrdinal(startDate)}
                      </Text>
                      <Text as='span' display='block' fontSize='lg' color='gray' align='center'>to</Text>
                      <Text
                        as='span'
                        display='block'
                      >
                        {getShortMonth(endDate)} {getDateWithOrdinal(endDate)}
                      </Text>
                    </Heading>
                    )
                  }
                </VStack>
              </Box>
            </Card>
          )
        })}
      </Flex>
    </Box>
  )
}
