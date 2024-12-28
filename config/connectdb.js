import mongoose from "mongoose";

const connectDB = async(DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbname: "Student"
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log('Connected Successfully')
    } catch (error) {
        console.log('Error while connecting to database')
    }
}

export default connectDB