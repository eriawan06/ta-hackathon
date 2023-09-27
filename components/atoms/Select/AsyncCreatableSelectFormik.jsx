import { AsyncCreatableSelect } from "chakra-react-select";

export default function AsyncCreatableSelectFormik({
    field: { name, value }, // { name, value, onChange, onBlur }
    form: { setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
}) {
    const defaultValue = (options, value) => {
        return options ? options.find(option => option.value === value) : null
    }

    return (
        <AsyncCreatableSelect
            classNamePrefix="chakra-react-select"
            variant="filled"
            ref={props.innerRef}
            closeMenuOnSelect={!props.isMulti}
            value={defaultValue(props.defaultOptions, value)}
            cacheOptions
            onChange={(option) => {
                if (option != null) setFieldValue(name, option.value)
                if (props.onValueChange !== undefined && option != null) props.onValueChange(option.value, setFieldValue)
            }}
            onCreateOption={async (inputValue) => {
                const newOption = await props.onCreate(inputValue)
                if (newOption != null) {
                    props.innerRef.current.setValue(newOption, 'set-value')
                    setFieldValue(name, newOption.value)
                }
            }}
            {...props}
        />
    )
}