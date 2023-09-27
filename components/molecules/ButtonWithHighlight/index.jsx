import { Button } from '@chakra-ui/react'

import Highlight from 'components/atoms/Highlight'

export default function ButtonWithHighlight({
  children,
  variant,
  highlightColorScheme,
  ...rest
}) {
  return (
    <Button
      variant={variant ?? 'ghost'}
      {...rest}
    >
      <Highlight
        display='inline'
        colorScheme={highlightColorScheme}
      >
        {children}
      </Highlight>
    </Button>
  )
}
