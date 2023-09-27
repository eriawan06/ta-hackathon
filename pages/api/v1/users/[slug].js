// getParticipantProfile /participants/profile
export default async function handler(req, res) {
  const slug = req.query.slug ?? ''

  if (slug.includes('participants') && slug.includes('profile')) {
    return res.status(200).json({
      message: 'Get Participant Profile Success',
      data: {
        id: 1,
        name: 'John Doe',
        email: 'email@email.com',
        phone: '081234567890'
      }
    })
  }
}
