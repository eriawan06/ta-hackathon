import LoadingOverlay from 'components/molecules/LoadingOverlay'
import DashboardLayout from 'layouts/DashboardLayout'

DashboardIndex.getLayout = (page) => {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default function DashboardIndex() {
  return <LoadingOverlay isFullScreen />
}

export function getServerSideProps({ req }) {
  return {
    props: { cookies: req.cookies }
  }
}
