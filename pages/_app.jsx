import { ChakraProvider } from '@chakra-ui/react'

import 'styles/globals.css'

import 'react-quill/dist/quill.snow.css'

import theme from 'theme'

export default function NextApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page)

  // console.log(Component.getLayout)

  return (
    <ChakraProvider theme={theme}>
      {getLayout(<Component {...pageProps} />)}
    </ChakraProvider>
  )
}
