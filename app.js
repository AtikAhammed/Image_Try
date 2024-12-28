import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import connectDB from './config/connectdb.js'
import userRoutes from './routes/userRoutes.js'

const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

// Middleware
app.use(cors())
app.use(morgan('common'))
app.use(helmet())
app.use(express.json())

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
})
app.use(limiter)

// Database Connection
connectDB(DATABASE_URL)

// Load Routes
app.use("/api/user", userRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})