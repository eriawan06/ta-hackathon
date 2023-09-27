export default async function handler(req, res) {
  const slug = req.query.slug ?? ''

  console.log('slug', slug)

  // postAuthLoginAdmin '/login/admin'
  if (slug.includes('login') && slug.includes('admin')) {
    return res.status(200).json({
      message: 'Login Admin Success',
      data: {
        token: 'token admin'
      }
    })
  }

  // postAuthLogin '/login'
  if (slug.includes('login')) {
    return res.status(200).json({
      message: 'Login Success',
      data: {
        token: 'token user'
      }
    })
  }

  res.status(404).json({
    message: 'sorry, data not found'
  })
}
