import express from 'express';
import multer from 'multer';
import { PineconeClient, PineconeDocument } from 'pinecone-client';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Pinecone setup
const apiKey = process.env.PINECONE_API_KEY;
const environment = 'us-west1-gcp';
const indexName = process.env.PINECONE_INDEX_NAME;
const pinecone = new PineconeClient({ apiKey, environment });

const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });

// Enable JSON body parsing middleware
app.use(express.json());

// Corrected missing closing parenthesis for the function and missing async keyword
app.post('/test', async (req, res) => {
    const data = req.body;
    console.log(data);
    res.json({ message: 'Received data' });
}); // Added a missing closing bracket and parenthesis

app.post('/upload', upload.single('file'), async (req, res) => {
    if (req.file) {
        const filePath = req.file.path;
        const dataBuffer = fs.readFileSync(filePath);
        
        try {
            const data = await pdfParse(dataBuffer);
            const document: PineconeDocument = {
                id: req.file.filename, // Use filename as ID or generate a unique one
                values: convertTextToVector(data.text) // Implement this function based on your requirements
            };

            const index = pinecone.Index(indexName);
            await index.upsert([document]);
            res.json({ message: 'PDF uploaded and indexed successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to process PDF' });
        } finally {
            // Clean up uploaded file
            fs.unlinkSync(filePath);
        }
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

function convertTextToVector(text: string): number[] {
    // Dummy vector conversion, replace with your actual implementation
    return text.split(' ').map(word => word.length);
}
