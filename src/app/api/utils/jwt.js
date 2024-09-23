import jwt from 'jsonwebtoken'

export function getUserIdFromToken(token) {
  try {
    // Decode the JWT token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Assuming the payload contains 'id' for the user
    return decoded.id
  } catch (error) {
    console.error('Error decoding JWT:', error)

return null
  }
}
