export default async function handler(req, res) {
  return res.status(200).json({
    message: 'Get Payment Methods Success',
    data: [
      {
        id: 1,
        name: 'Bank Transfer',
        account_number: '1234567890',
        account_name: 'Sagara Tester',
        image: '/images/payment-methods/bank-transfer.png'
      },
      {
        id: 2,
        name: 'Credit Card',
        account_number: '1234567890',
        account_name: 'Sagara Tester',
        image: '/images/payment-methods/credit-card.png'
      },
      {
        id: 3,
        name: 'E-Wallet',
        account_number: '1234567890',
        account_name: 'Sagara Tester',
        image: '/images/payment-methods/e-wallet.png'
      }
    ]
  })
}
