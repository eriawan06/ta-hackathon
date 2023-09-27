export default async function handler(req, res) {
  return res.status(200).json({
    message: 'Get Participant Profile Success',
    data: {
      id: 1,
      full_name: 'Sagara Tester',
      avatar: '/images/users/cat.jpeg',
      speciality_name: 'Web Developer',
      location: 'Surabaya',
      email: 'email@email.com',
      phone_number: '081234567890'
    }
  })
}
