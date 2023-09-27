import {
  Box,
  Heading,
  Button,
  VStack,
  Card,
  Flex,
  Spacer,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  useControllableState
} from '@chakra-ui/react'

import DashboardLayout from 'layouts/DashboardLayout'
import Seo from 'components/atoms/Seo'

import { siteTitle } from 'config'
import CompleteRegistrationForm1 from 'components/organisms/Dashboard/CompleteRegistration/StepOneForm'
import CompleteRegistrationForm2 from 'components/organisms/Dashboard/CompleteRegistration/StepTwoForm'
import CompleteRegistrationForm3 from 'components/organisms/Dashboard/CompleteRegistration/StepThreeForm'
import CompleteRegistrationForm4 from 'components/organisms/Dashboard/CompleteRegistration/StepFourForm'
import { useEffect } from 'react'

CompleteRegistrationPageMultiStepForm.getLayout = (page) => {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default function CompleteRegistrationPageMultiStepForm() {
  const steps = [
    { title: 'Profile & Location' },
    { title: 'Education' },
    { title: 'Experience & Preferences' },
    { title: 'Summary' },
  ]

  let [step, setStep] = useControllableState({ defaultValue: 1 })

  const handleNext = () => {
    if (step <= steps.length ) {
      setStep(step+1)
    }
  }

  const handlePrev = () => {
    if (step >= 1) {
      setStep(step-1)
    }
  }

  return (
    <>
      <Seo title={`Complete Registration | ${siteTitle}`} />

      <VStack spacing={3} alignItems='start'>
        <Heading as='h1' fontSize='3xl'>
          Complete Registration!
        </Heading>
      </VStack>

      <Box my={10}>
        <Card
          variant='solid'
          layerStyle='dashboardCard'
          w='full'
          px={6}
          py={4}
        >
          <MultiStepFormStepper 
            steps={steps} 
            activeStepIndex={step-1} 
          />
        </Card>
      </Box>

      <Box my={10}>
        <Card
          variant='solid'
          layerStyle='dashboardCard'
          w='full'
          p={8}
        >
          {
            step === 1 ? <CompleteRegistrationForm1 /> :
            step === 2 ? <CompleteRegistrationForm2 /> :
            step === 3 ? <CompleteRegistrationForm3 /> :
            <CompleteRegistrationForm4 />
          }
        </Card>
      </Box>

      <Box my={10}>
        <Flex>
          <Box w='10%'>
            <Button
              colorScheme='red'
              w='full'
              isDisabled={step === 1}
              onClick={handlePrev}
            >
              Previous
            </Button>
          </Box>
          <Spacer />
          <Box w='10%'>
            <Button
              colorScheme='red'
              w='full'
              onClick={() => handleNext()}
            >
              { step === steps.length ? 'Finish' : 'Next' }
            </Button>
          </Box>
        </Flex>
      </Box>
    </>
  )
}



function MultiStepFormStepper({ steps, activeStepIndex }) {

  const { activeStep, setActiveStep } = useSteps({
    index: activeStepIndex,
    count: steps.length,
  })

  useEffect(() => {
    setActiveStep(activeStepIndex)
  }, [activeStepIndex])

  return (
    <Stepper size='lg' colorScheme='red' index={activeStep}>
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink='0'>
            <StepTitle>{step.title}</StepTitle>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  )
}
