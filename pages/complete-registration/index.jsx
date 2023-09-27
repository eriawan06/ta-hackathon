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
import CompleteRegistrationForm from 'components/organisms/Dashboard/CompleteRegistration/FullForm'

CompleteRegistrationPage.getLayout = (page) => {
    return <DashboardLayout>{page}</DashboardLayout>
}

export default function CompleteRegistrationPage() {
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
                    p={8}
                >
                    <CompleteRegistrationForm />
                </Card>
            </Box>
        </>
    )
}

