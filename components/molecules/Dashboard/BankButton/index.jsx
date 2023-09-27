import { Button, Skeleton, Text } from '@chakra-ui/react'

export default function BankButton({
  title='',
  bankName,
  accountName,
  accountNumber,
  isLoading,
  ...rest
}) {
  return (
    <Button
      justifyContent='start'
      h='auto'
      p={4}
      bg='gray.700'
      _hover={{ bg: 'gray.600' }}
      _active={{ bg: 'gray.500' }}
      borderRadius='lg'
      borderLeft={2}
      borderLeftColor='red'
      borderLeftStyle='solid'
      textAlign='left'
      {...rest}
    >
      <span>
        <Skeleton isLoaded={!isLoading}>
          <Text
            as='span'
            display='block'
            fontSize='xs'
            fontWeight='light'
            mb={2}
          >
            {title?? 'Bank Account'}
          </Text>
        </Skeleton>

        <Skeleton isLoaded={!isLoading}>
          <Text
            as='strong'
            display='block'
            fontSize='xl'
          >
            {bankName && bankName}
          </Text>
        </Skeleton>

        {/* <Skeleton isLoaded={!isLoading}>
          <Text
            as='p'
            fontSize='sm'
            mb={1}
          >
            {accountName && accountName}
          </Text>
        </Skeleton>

        <Skeleton isLoaded={!isLoading}>
          <Text
            as='p'
            fontWeight='normal'
            fontSize='sm'
          >
            {accountNumber && accountNumber}
          </Text>
        </Skeleton> */}
      </span>
    </Button>
  )
}
