import { SingleDatepicker } from "chakra-dayzed-datepicker";

export default function DatePickerFormik({
    field: { name, value }, // { name, value, onChange, onBlur }
    form: { setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
}) {
    return (
        <SingleDatepicker
            name={name}
            date={value}
            onDateChange={val => { setFieldValue(name, val, true) }}
            maxDate={new Date('2010-12-31')}
        />
    )
}