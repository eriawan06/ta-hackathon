export default async function handler(req, res) {
  return res.status(200).json({
    message: 'Upload Success',
    data: {
      id: 1,
      invoice_number: 'INV-2021-0001',
      participant_name: 'Sagara Tester',
      participant_phone: '081234567890',
      event_id: 1,
      account_name: 'Sagara Tester',
      account_number: '1234567890',
      bank_name: 'Bank BCA',
      evidence: 'https://example.com/evidence.png',
      amount: 100000,
      proceed_at: '2021-01-01 00:00:00'
    }
  })
}
