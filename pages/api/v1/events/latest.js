export default function handler(req, res) {
  return res.status(200).json({
    message: 'get latest events success',
    data: {
      id: 1,
      payment_due_date: '2021-09-30',
      reg_fee: 100000
    }
  })
}
