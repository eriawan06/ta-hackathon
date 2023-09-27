const baseStyle = (props) => {
  const { colorScheme: c } = props
  return {
    display: 'inline',
    color: 'white',
    backgroundColor: c ? `${c}.500` : 'black'
  }
}

const Highlight = {
  baseStyle
}

export default Highlight
