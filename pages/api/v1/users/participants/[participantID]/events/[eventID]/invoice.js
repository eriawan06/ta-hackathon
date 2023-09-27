export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json({
        message: 'Get Success',
        data: {
          id: 1,
          invoice_number: 'INV-0001',
          payment_status: 'paid'
        }
      })
    case 'POST':
      return res.status(200).json({
        message: 'Upload Success',
        data: {
          id: 1,
          invoice_number: 'INV-0001',
          payment_status: 'paid'
        }
      })
    default:
      return res.status(405).json({
        message: 'Method Not Allowed',
        data: null
      })
  }
}
