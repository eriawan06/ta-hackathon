import { useRef, useState } from 'react'

import {
  Box,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Icon,
  Link,
  List,
  ListItem,
  Spinner,
  Text,
  VisuallyHiddenInput,
  VStack
} from '@chakra-ui/react'
import { BsCloudArrowUpFill, BsCloudCheckFill } from 'react-icons/bs'

/**
 * Reusable component to handle file upload
 * @param {HTMLInputTypeAttribute} inputProps - additional props for html file input element
 * @param {(File) => void} onChange - function to handle file change, mainly to upload file,
 *
 */
export default function FileUploader({
  label,
  onChange,
  accept,
  error,
  isLoading,
  isSuccess,
  currentFile,
  multiple = false // default is false
}) {
  const inputRef = useRef(null)
  const [files, setFiles] = useState(null)

  const handleUploadBoxClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e) => {
    setFiles(Array.from(e.target.files))

    onChange && onChange(e)
  }

  return (
    <FormControl isInvalid={!!error}>
      <Box
        p={4}
        borderRadius='lg'
        background='gray.700'
      >
        {label && (
          <Heading
            as='h5'
            mb={2}
            fontSize='base'
          >
            {label}
          </Heading>
        )}

        {currentFile && (
          <Text
            as='p'
            mb={2}
            fontSize='sm'
          >
            Current file:{' '}
            <Link
              rel='noopener noreferrer'
              target='_blank'
              href={currentFile.url}
            >
              {currentFile.name}
            </Link>
          </Text>
        )}

        <Center
          display='block'
          w='full'
          p={8}
          borderRadius='lg'
          bg='gray.600'
          borderWidth='medium'
          borderColor='gray.300'
          borderStyle='dashed'
          textAlign='center'
          cursor='pointer'
          onClick={!isLoading ? handleUploadBoxClick : undefined}
        >
          <VStack
            spacing={2}
            w='full'
          >
            {isLoading ? (
              <Spinner size='xl' />
            ) : isSuccess ? (
              <Icon
                as={BsCloudCheckFill}
                fontSize='3xl'
              />
            ) : (
              <Icon
                as={BsCloudArrowUpFill}
                fontSize='3xl'
              />
            )}

            <Box
              w='full'
              fontSize='sm'
            >
              {files && files.length > 0 ? (
                files.length > 1 ? (
                  <List
                    spacing={2}
                    w='full'
                    textAlign='left'
                  >
                    {files?.map((file, i) => (
                      <ListItem key={`file-upload-${i}`}>{file.name}</ListItem>
                    ))}
                  </List>
                ) : (
                  <Text as='p'>{files?.[0]?.name}</Text>
                )
              ) : (
                <Text
                  w='full'
                  textAlign='center'
                >
                  Click or drop file here to upload...
                </Text>
              )}
            </Box>
          </VStack>

          <VisuallyHiddenInput
            ref={inputRef}
            type='file'
            accept={accept}
            onChange={handleChange}
            multiple={multiple}
          />
        </Center>

        {(isSuccess || accept) && (
          <FormHelperText>
            {isSuccess && (
              <Text
                as='p'
                color='white'
              >
                File uploaded succesfully
              </Text>
            )}
            {accept && !isSuccess && (
              <Text as='p'>Accepted file types: {accept}</Text>
            )}
          </FormHelperText>
        )}

        <FormErrorMessage>{error}</FormErrorMessage>
      </Box>
    </FormControl>
  )
}
