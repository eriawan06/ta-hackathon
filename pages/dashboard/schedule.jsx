import Card from 'components/atoms/Card'

import DashboardMainLayout from 'layouts/DashboardMainLayout'

import ListSchedule from 'components/organisms/Dashboard/SchedulePanel/ListSchedule'
import { useState } from 'react'
import DetailSchedule from 'components/organisms/Dashboard/SchedulePanel/DetailSchedule'

DashboardSchedule.getLayout = (page) => {
  return <DashboardMainLayout pageTitle='Schedule'>{page}</DashboardMainLayout>
}

export default function DashboardSchedule() {
  const [step, setStep] = useState('list') //list, detail
  const [selectedSchedule, setSelectedSchedule] = useState(null)

  const handleOpenDetail = (scheduleId) => {
    setSelectedSchedule(scheduleId)
    setStep('detail')
  }

  const handleOnBack = () => {
    setSelectedSchedule(null)
    setStep('list')
  }

  return (
    <Card
      variant='solid'
      layerStyle='dashboardCard'
      w='full'
      maxHeight='485px'
      overflow='hidden'
    >
      {step === 'list' && <ListSchedule openDetail={handleOpenDetail} />}
      {step === 'detail' && <DetailSchedule id={selectedSchedule} onBack={handleOnBack} />}

    </Card>
  )
}
