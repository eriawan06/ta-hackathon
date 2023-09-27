import { useCallback, useState } from 'react'
import { postUpload } from 'services/general'

const generateInputKey = (path) => `upload-${path}-${Date.now()}`

export function useFileUploader({ path, validate, previousFile }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [inputKey, setInputKey] = useState(generateInputKey(path))

  const handleFileChange = useCallback(
    async (e) => {
      const files =
        e.target.files.length > 0 ? Array.from(e.target.files) : null

      setError(null)
      setIsLoading(true)

      if (!files) {
        setData(null)

        return
      }

      try {
        const validationError = validate ? validate(files) : null
        if (validationError)
          throw new Error(
            `File validation error, ${validationError.join(', ')}.`
          )

        if (files.length > 1) {
          // TODO: handle multiple file upload
        } else {
          const formData = new FormData()
          formData.append('path', path)
          formData.append('file', files[0])

          if (previousFile) {
            formData.append('overwrite', true)
            formData.append('previous_file', previousFile)
          }

          const res = await postUpload(formData)

          setData(res.data.data)
          return res.data.data
        }
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    },
    [path, validate, previousFile]
  )

  const reset = () => {
    setData(null)
    setError(null)
    setIsLoading(false)
    setInputKey(generateInputKey(path))
  }

  return {
    inputFileProps: {
      key: inputKey,
      onChange: handleFileChange,
      multiple: false // currently, hooks doesn't support multiple file
    },
    data,
    error,
    isLoading,
    reset
  }
}
