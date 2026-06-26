import express from 'express';
import cors from 'cors'; 
import listingRoutes from './routes/listingRoutes.js'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 

app.use('/listings', listingRoutes); 

// app.get('/', (req, res)=>{
//   res.end('Chamber API is running');
// })


app.listen(PORT, ()=> {
  console.log(`Server up at PORT ${PORT}`);
});