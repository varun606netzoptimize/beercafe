import jwt from 'jsonwebtoken'

export const verifyAdmin = async req => {
  const authHeader = req.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ message: 'No token provided or invalid format' }), { status: 401 })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if the user is an admin
    if (decoded.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 403 })
    }

    return null // Return null if the user is an admin
  } catch (err) {
    console.error('Error verifying token:', err)

    return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 })
  }
}
