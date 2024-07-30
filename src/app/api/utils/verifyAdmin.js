import jwt from 'jsonwebtoken'

export const verifyAdmin = async req => {
  const authHeader = req.headers.get('Authorization')

  if (!authHeader) {
    return new Response(JSON.stringify({ message: 'No token provided' }), { status: 401 })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.role === 'User') {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 403 })
    }

    return null // Return null if the user is authorized
  } catch (err) {
    console.error(err)

    return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 })
  }
}
