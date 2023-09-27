import { AsyncSelect } from "chakra-react-select";

export default function AsyncSelectFormik({
    field: { name, value }, // { name, value, onChange, onBlur }
    form: { setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
}) {
    const defaultValue = (options, value) => {
        if (!props.isMulti) return options ? options.find(option => option.value === value) : null

        let defaultValues = []
        if (value !== null && value !== undefined && options !== undefined) {
            value.forEach(element => {
                defaultValues.push(options.find(option => option.value === element))
            });
        }

        return defaultValues
    }

    return (
        <AsyncSelect
            classNamePrefix="chakra-react-select"
            variant="filled"
            ref={props.innerRef}
            closeMenuOnSelect={!props.isMulti}
            value={defaultValue(props.defaultOptions, value)}
            cacheOptions
            onChange={(option, actionType) => {
                if (props.isMulti && option != null) {
                    if (actionType.action == 'select-option') {
                        option.forEach(el => {
                            setFieldValue(name, [...value, el.value])
                        });
                    }

                    if (actionType.action == 'remove-value') {
                        const newValue = value.filter(el => el !== actionType.removedValue.value)
                        setFieldValue(name, [...newValue])
                    }

                    if (props.onValueChange !== undefined) props.onValueChange(option.value, setFieldValue, option)
                }

                if (!props.isMulti && option != null) {
                    setFieldValue(name, option.value)
                    if (props.onValueChange !== undefined) props.onValueChange(option.value, setFieldValue, option)
                }
            }}
            {...props}
        />
    )
}