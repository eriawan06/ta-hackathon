import { useRef } from 'react'
import { useToast } from '@chakra-ui/react'

export function useFormToast(id) {
  const toast = useToast()
  const toastRef = useRef()

  const send = (status, title, description) => {
    toastRef.current = toast({
      id,
      title,
      description,
      status,
      duration: 10000,
      isClosable: true
    })
  }

  const close = () => toast.close(toastRef.current)

  return {
    send,
    close
  }
}
