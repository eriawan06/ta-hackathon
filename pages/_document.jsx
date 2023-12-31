import { Html, Head, Main, NextScript } from 'next/document'

import { ColorModeScript } from '@chakra-ui/react'

import theme from 'theme'

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel='preconnect'
          href='https://fonts.googleapis.com'
        />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='crossOrigin'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&amp;family=Roboto:wght@300;400;700&amp;display=swap'
        />
      </Head>

      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
