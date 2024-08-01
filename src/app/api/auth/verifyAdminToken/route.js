import jwt from 'jsonwebtoken'

export async function GET(req, res) {
  const token = req.headers.get('Authorization')?.split(' ')[1]

  if (!token) {
    return new Response(JSON.stringify({ message: 'No token provided' }), { status: 401 })
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Determine the role and construct a response message
    let userType

    switch (decoded.role) {
      case 'admin':
        userType = 'admin'
        break
      case 'manager':
        userType = 'manager'
        break
      case 'user':
        userType = 'user'
        break
      case 'owner':
        userType = 'owner'
        break
      default:
        userType = 'unknown'
    }

    return new Response(JSON.stringify({ message: 'Token is valid', userType, user: decoded }), { status: 200 })
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 })
    }

    console.error(err)

    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
  }
}
