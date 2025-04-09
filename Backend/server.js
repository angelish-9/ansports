import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToDb } from './config/db.js';
// import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
// import adminRouter from './routes/adminRoute.js'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Enable CORS with specific origins
const corsOptions = {
    origin: 'http://localhost:5173', // Allow only the frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
};

app.use(cors(corsOptions));

// app.use(cors());

// Get the current directory name using `import.meta.url`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

// Serve static files (images) from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

(async () => {
    try {
        await connectToDb();
        // await connectCloudinary();
        console.log('Connected to database');
    } catch (error) {
        console.error('Error connecting:', error);
        process.exit(1);
    }
})();


app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
