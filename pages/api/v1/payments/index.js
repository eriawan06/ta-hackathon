const paymentsDummy = {
  id: 1,
  invoice_id: 1,
  invoice_number: 'INV-2021-0001',
  participant_id: 1,
  participant_name: 'Sagara Tester',
  participant_email: 'email@email.com',
  participant_phone: '081234567890',
  event_id: 1,
  event_name: 'Event Name',
  payment_method_id: 1,
  payment_method: 'Bank Transfer',
  account_name: 'Sagara Tester',
  account_number: '1234567890',
  bank_name: 'Bank BCA',
  evidence: 'https://example.com/evidence.png',
  amount: 100000,
  proceed_at: '2021-01-01 00:00:00',
  proceed_by: 1,
  note: 'Note',
  created_at: '2021-01-01 00:00:00',
  created_by: 1,
  updated_at: '2021-01-01 00:00:00',
  updated_by: 1
}

export default async function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        return res.status(200).json({
          message: 'Get Payments Success',
          data: {
            ...paymentsDummy
          }
        })
      } catch (err) {
        return res.status(500).json({
          message: 'Get Payments Failed',
          data: null
        })
      }
    case 'POST':
      try {
        return res.status(200).json({
          message: 'Post Payment Success',
          data: {
            ...paymentsDummy,
            ...req.body
          }
        })
      } catch (err) {
        return res.status(500).json({
          message: 'Post Payment Failed',
          data: null
        })
      }
    default:
      return res.status(405).json({
        message: 'Method Not Allowed',
        data: null
      })
  }
}
