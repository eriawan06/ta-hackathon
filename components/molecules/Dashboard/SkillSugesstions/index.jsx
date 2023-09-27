import { Tag, Wrap, WrapItem } from '@chakra-ui/react'
import { useFormikContext } from 'formik'

const skillSuggestions = [
  'HTML',
  'CSS',
  'Javascript',
  'Python',
  'Flutter',
  'React.js',
  'React Native'
]

export default function SkillSuggestions() {
  const {
    values: { skills },
    setFieldValue
  } = useFormikContext()

  const handleAppendSkillByTag = (newSkill) => {
    return () =>
      setFieldValue('skills', !skills ? newSkill : `${skills}, ${newSkill}`)
  }

  return (
    <Wrap>
      {skillSuggestions.map((s, i) => (
        <WrapItem key={`skill-suggestion-${i}`}>
          <Tag
            cursor='pointer'
            onClick={handleAppendSkillByTag(s)}
          >
            {s}
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  )
}
