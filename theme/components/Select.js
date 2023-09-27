const variantWhite = (props) => {
  return {
    field: {
      border: '1px solid',
      borderColor: 'inherit',
      bg: 'white',
      color: 'black',
      _placeholder: {
        color: 'gray',
        opacity: 1
      },
    },
    icon: {
      color: 'black'
    },
  }
}

const Select = {
  variants: {
    white: variantWhite
  }
}

export default Select
