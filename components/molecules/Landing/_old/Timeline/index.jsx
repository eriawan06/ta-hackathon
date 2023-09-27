import { Box, Circle, Flex, Heading, Icon, VStack } from '@chakra-ui/react'
import { BsCheckLg, BsTriangleFill } from 'react-icons/bs'

export default function Timeline({ items, finishedCount = 2 }) {
  const itemCount = items.length
  const itemWidth = itemCount >= 5 ? 20 : 100 / itemCount // max

  return (
    <Box overflow='hidden'>
      <Box
        overflowX={{ base: 'auto' }}
        pb={4}
        mb={-4}
      >
        <Flex
          position='relative'
          flexWrap='nowrap'
          w={{
            base: `${80 * itemCount}%`,
            md: `${40 * itemCount}%`,
            lg: `${itemCount > 5 ? itemCount * 16 : 100}%`
          }}
        >
          <Box
            id='progress-bg'
            position='absolute'
            insetX='0'
            top='2.75rem'
            h={6}
            p={1}
            borderRadius='full'
            bg='white'
          >
            <Box
              id='progress-fg'
              left='0'
              top='0'
              w={`${finishedCount * itemWidth}%`}
              h='100%'
              borderRadius='full'
              bg='red'
            />
          </Box>

          {items.map((item, i) => (
            <VStack
              key={i}
              flexGrow={0}
              flexShrink={0}
              w={`${itemWidth}%`}
              align='stretch'
              spacing={4}
              textAlign='center'
            >
              <Heading
                as='h5'
                fontSize='base'
                color={finishedCount >= i + 1 ? 'red' : 'white'}
                lineHeight='1'
              >
                {item.name}
              </Heading>

              <Box
                position='relative'
                zIndex={10}
              >
                <Circle
                  size={12}
                  mx='auto'
                  bg={finishedCount >= i + 1 ? 'red.500' : 'gray.300'}
                  color='white'
                  borderWidth='thick'
                  borderColor='white'
                >
                  <Icon
                    as={BsCheckLg}
                    fontSize='xl'
                  />
                </Circle>
              </Box>

              <Box>
                <Icon
                  as={BsTriangleFill}
                  color={finishedCount >= i + 1 ? 'red.500' : 'gray.300'}
                  transform={
                    finishedCount >= i + 1 ? 'rotate(180deg)' : 'nonde'
                  }
                  mx='auto'
                  fontSize='xl'
                />
              </Box>

              {item.content && (
                <Box
                  position='relative'
                  px={4}
                  flexGrow='1'
                >
                  {item.content}
                </Box>
              )}
            </VStack>
          ))}
        </Flex>
      </Box>
    </Box>
  )
}
