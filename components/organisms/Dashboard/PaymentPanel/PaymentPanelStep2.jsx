import { useEffect, useMemo, useState } from 'react'

import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  SimpleGrid,
  Box,
  Input,
  Skeleton,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react'

import Alert from 'components/atoms/Alert'
import FileUploader from 'components/molecules/FileUploader'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { useLatestEvents } from 'hooks/swr/events'
import { useFormToast } from 'hooks/form-toast'
import { useFileUploader } from 'hooks/upload'

import { getPaymentMethods, postPayment } from 'services/payments'

import { useParticipantInvoice } from 'hooks/swr/payments'
import { useParticipantProfile } from 'hooks/swr/users'

import { getFormattedIDR } from 'libs/currencyFormatter'
import AsyncSelectFormik from 'components/atoms/Select/AsyncSelectFormik'
import { getFormattedDate, getFormattedTime } from 'libs/dateFormatter'

const initialValues = {
  invoice_id: 0,
  payment_method_id: null,
  account_name: '',
  account_number: '',
  bank_name: '',
  evidence: ''
}

const validationSchema = Yup.object().shape({
  payment_method_id: Yup.number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Required'),
  account_name: Yup.string().required('Required'),
  account_number: Yup.string()
    .matches(/[0-9]/, 'Make sure you input account number in valid format')
    .required('Required'),
  bank_name: Yup.string().required('Required'),
})

export default function PaymentPanelStep2({ onComplete }) {
  const toast = useFormToast('payment-panel-step-2')
  const [paymentMethods, setPaymentMethods] = useState([])
  const [isPaymentMethodsLoading, setIsPaymentMethodsLoading] = useState(true)

  // DATA FECTHING
  const { data: participantProfile } = useParticipantProfile()
  const { data: latestEvent, isLoading: isLatestEventLoading } = useLatestEvents()

  const {
    data: participantInvoice,
    isLoading: isParticipantInvoiceLoading,
    mutate: mutateParticipantInvoice
  } = useParticipantInvoice(participantProfile.id, latestEvent.id)

  useEffect(() => {
    getPaymentMethods({ order: 'id,asc', limit: 20, page: 1, status: 'active' })
      .then((res) => {
        if (res && res.status === 200) {
          const data = res.data.data.methods
          data.forEach(method => {
            method.value = method.id
            method.label = method.name
          });

          setPaymentMethods(data)
        }
        setIsPaymentMethodsLoading(false)
      })
  }, [])

  // UPLOAD HELPER
  const paymentEvidenceUploader = useFileUploader({
    path: 'payment-evidence',
    validate: (files) => files[0].size > 2000000 ? ['maximum file size is 2MB'] : null
  })

  const isPaymentEvidenceUploadSuccess = useMemo(() => {
    return (
      paymentEvidenceUploader.data &&
      !paymentEvidenceUploader.isLoading &&
      !paymentEvidenceUploader.error
    )
  }, [
    paymentEvidenceUploader.data,
    paymentEvidenceUploader.isLoading,
    paymentEvidenceUploader.error
  ])

  const isNextButtonDisabled = useMemo(
    () => !isPaymentEvidenceUploadSuccess || isParticipantInvoiceLoading,
    [isPaymentEvidenceUploadSuccess, isParticipantInvoiceLoading]
  )

  const getDetailSelectedPaymentMethod = (selected) => {
    return paymentMethods.find(el => el.id === selected)
  }

  const handleSubmit = async (values) => {
    toast.close()

    if (paymentEvidenceUploader.isLoading) {
      toast.send(
        'info',
        'Uploading File',
        "Please wait while we're uploading payment proof, then submit the form again."
      )

      return
    }

    if (!paymentEvidenceUploader.data) {
      toast.send(
        'info',
        'Uploading File',
        'Please upload your payment evidence before submitting the form'
      )

      return
    }

    if (paymentEvidenceUploader.error) {
      toast.send(
        'info',
        'Uploading File',
        'Please make sure your payment evidence is succesfully uploaded, otherwise reupload and try again/'
      )

      return
    }

    try {
      const res = await postPayment({
        account_name: values.account_name,
        account_number: values.account_number,
        bank_name: values.bank_name,
        evidence: paymentEvidenceUploader.data.file_url,
        invoice_id: parseInt(participantInvoice.id),
        payment_method_id: values.payment_method_id
      })

      if (res && res.status === 201) {
        toast.send(
          'success',
          'Saved!',
          'Sucessfully create payment.'
        )

        mutateParticipantInvoice()
        onComplete()
      }
    } catch (err) {
      let title = 'Form Error!'
      let message = err.message

      if (err.response?.status === 400) {
        title = 'Saving Failed!'
        message = 'Please make sure your input is valid and try again...'
      }

      toast.send('error', title, message)
    }
  }

  return (
    <div id='payment-panel-step-2'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, values }) => (
          <>
            <Skeleton isLoaded={!isLatestEventLoading}>
              <SimpleGrid columns={2} spacing={8}>
                <Alert as='p' mb={8}>
                  Please pay the required payment of{' '} <b>{getFormattedIDR(latestEvent.reg_fee)}</b> to :
                  {
                    paymentMethods && getDetailSelectedPaymentMethod(values.payment_method_id) ? (
                      <>
                        <br /><br /><b>{getDetailSelectedPaymentMethod(values.payment_method_id).name}</b>
                        <br /><b>{getDetailSelectedPaymentMethod(values.payment_method_id).account_number}</b>
                        <br /><b>{getDetailSelectedPaymentMethod(values.payment_method_id).account_name}</b>
                      </>
                    ) : ''
                  }
                </Alert>

                <Box mb={8}>
                  <Text
                    as='span'
                    display='block'
                    fontSize='sm'
                    mb={2}
                  >
                    Pay Before
                  </Text>

                  <Skeleton isLoaded={!isLatestEventLoading}>
                    <Text as='strong' fontSize='xl'>
                      {latestEvent?.payment_due_date
                        ? getFormattedDate(new Date(latestEvent?.payment_due_date))
                        : '-'}
                    </Text>
                    <br />
                    {latestEvent?.payment_due_date &&
                      <Text as='strong' fontSize='xl'>
                        {getFormattedTime(new Date(latestEvent?.payment_due_date))} GMT+7
                      </Text>}
                  </Skeleton>
                </Box>
              </SimpleGrid>

              <Divider mb={8} />
            </Skeleton>

            <Form>
              <Grid
                templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
                gap={8}
                mb={8}
              >
                <GridItem>
                  <VStack align='stretch' gap={4}>
                    <FormControl
                      isRequired
                      isInvalid={touched.payment_method_id && errors.payment_method_id}
                    >
                      <FormLabel htmlFor='payment_method_id'>Select Bank</FormLabel>
                      <Field
                        component={AsyncSelectFormik}
                        id='payment_method_id'
                        name='payment_method_id'
                        type='number'
                        placeholder="Select bank"
                        isLoading={isPaymentMethodsLoading}
                        defaultOptions={paymentMethods}

                      />

                      <FormErrorMessage>{errors.payment_method_id}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isRequired
                      isInvalid={touched.bank_name && errors.bank_name}
                    >
                      <FormLabel fontSize='xs' htmlFor='bank_name'>Bank Name</FormLabel>
                      <Field
                        as={Input}
                        id='bank_name'
                        name='bank_name'
                        variant='white'
                        type='text'
                        placeholder='Enter your bank name here...'
                      />
                      <FormErrorMessage>{errors.bank_name}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isRequired
                      isInvalid={touched.account_name && errors.account_name}
                    >
                      <FormLabel fontSize='xs' htmlFor='account_name'>Bank Account Name</FormLabel>
                      <Field
                        as={Input}
                        id='account_name'
                        name='account_name'
                        variant='white'
                        type='text'
                        placeholder='Enter your bank account name here...'
                      />
                      <FormErrorMessage>{errors.account_name}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isRequired
                      isInvalid={touched.account_number && errors.account_number}
                    >
                      <FormLabel fontSize='xs' htmlFor='account_name'>Bank Account Number</FormLabel>
                      <Field
                        as={Input}
                        id='account_number'
                        name='account_number'
                        variant='white'
                        type='text'
                        placeholder='Enter your bank account number here...'
                      />
                      <FormErrorMessage>{errors.account_number}</FormErrorMessage>
                    </FormControl>
                  </VStack>
                </GridItem>

                <GridItem>
                  <Text
                    as='span'
                    display='block'
                    fontSize='sm'
                    mb={2}
                  >
                    Upload your payment proof
                  </Text>

                  <FileUploader
                    key='payment-evidence-upload'
                    label='Upload Payment Proof'
                    accept='.png, .jpg, .jpeg, .pdf'
                    isLoading={paymentEvidenceUploader.isLoading}
                    isSuccess={isPaymentEvidenceUploadSuccess}
                    error={paymentEvidenceUploader.error?.message}
                    currentFile={null}
                    {...paymentEvidenceUploader.inputFileProps}
                  />
                </GridItem>
              </Grid>

              <Flex justify='flex-end'>
                <Button
                  type='submit'
                  variant='solid'
                  colorScheme='red'
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting || isNextButtonDisabled}
                >
                  Confirm payment
                </Button>
              </Flex>
            </Form>
          </>
        )}
      </Formik>
    </div>
  )
}
