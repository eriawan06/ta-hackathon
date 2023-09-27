/**
 * @see https://chakra-ui.com/docs/styled-system/theming/customize-theme#scaling-out-your-project
 */

import { extendTheme } from '@chakra-ui/react'

// theme config
import config from './config'

// global style
import styles from './styles'

// foundational styles
import fonts from './foundations/fonts'
import colors from './foundations/colors'

// components styles
import Alert from './components/Alert'
import Button from './components/Button'
import Container from './components/Container'
import Card from './components/Card'
import Heading from './components/Heading'
import Highlight from './components/Highlight'
import Input from './components/Input'
import Select from './components/Select'

// layer styles
import dashboardCard from './layers/dashboardCard'

const overrides = {
  config,
  styles,
  fonts,
  colors,
  components: {
    Alert,
    Button,
    Card,
    Container,
    Heading,
    Highlight,
    Input,
    Select
  },
  layerStyles: {
    dashboardCard
  }
}

export default extendTheme(overrides)
