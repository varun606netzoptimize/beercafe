import Cors from 'cors'

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  origin: 'https://beercafe-staging-pms8td8ap-varun606netzoptimizes-projects.vercel.app' // Adjust as needed
})

// Helper method to run CORS middleware
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default cors
