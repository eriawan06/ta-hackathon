import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Center,
  Flex
} from '@chakra-ui/react'

export default function PopupConfirmation({
  modalSize='xl',
  header,
  body,
  bodyTextAlign='center',
  button,
  isOpen,
  onClose,
  isForm=false,
  ...props
}) {
  return (
    <>
      <Modal
        size={modalSize}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        {...props}
      >
        <ModalOverlay />
        <ModalContent {...props}>
          <ModalHeader>
            <Center>
              <Heading fontSize='xl'>{header}</Heading>
            </Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign={bodyTextAlign}>{body}</ModalBody>

          {
            !isForm &&
            <ModalFooter>
              <Flex
                justifyContent='center'
                w='full'
              >
                <Button
                  colorScheme='red'
                  w='full'
                >
                  {button}
                </Button>
              </Flex>
            </ModalFooter>
          }
        </ModalContent>
      </Modal>
    </>
  )
}
