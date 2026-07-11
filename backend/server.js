import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // Limit to 10MB PDFs
});

// In-Memory Data Storage
const inMemoryPdfs = [];
const inMemoryChats = [];

// Helper to generate IDs
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// AI Configuration
const apiKey = process.env.GEMINI_API_KEY;
let isMockAi = false;
let genAI = null;

if (!apiKey) {
  console.warn('\n======================================================');
  console.warn('WARNING: GEMINI_API_KEY environment variable is missing.');
  console.warn('The application will run in MOCK AI MODE.');
  console.warn('Mocked summaries and chat responses will be generated.');
  console.warn('Configure GEMINI_API_KEY in backend/.env for real AI features.');
  console.warn('======================================================\n');
  isMockAi = true;
} else {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('Google Generative AI client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Google Generative AI client. Running in Mock AI mode.', err.message);
    isMockAi = true;
  }
}

// --- DATA ACCESS LAYER HELPERS ---

async function savePdfRecord(data) {
  const record = {
    _id: generateId(),
    ...data,
    uploadedAt: new Date()
  };
  inMemoryPdfs.push(record);
  return record;
}

async function getAllPdfRecords() {
  return inMemoryPdfs.map(({ extractedText, ...rest }) => rest);
}

async function getPdfRecordById(id) {
  const pdf = inMemoryPdfs.find(p => p._id === id);
  if (!pdf) throw new Error('PDF not found');
  return pdf;
}

async function deletePdfRecord(id) {
  const index = inMemoryPdfs.findIndex(p => p._id === id);
  if (index !== -1) {
    inMemoryPdfs.splice(index, 1);
    // Clean up chats
    let cIndex = inMemoryChats.length;
    while (cIndex--) {
      if (inMemoryChats[cIndex].pdfId === id) {
        inMemoryChats.splice(cIndex, 1);
      }
    }
    return true;
  }
  return false;
}

async function saveChatRecord(pdfId, role, message) {
  const record = {
    _id: generateId(),
    pdfId,
    role,
    message,
    timestamp: new Date()
  };
  inMemoryChats.push(record);
  return record;
}

async function getChatHistory(pdfId) {
  return inMemoryChats
    .filter(c => c.pdfId === pdfId)
    .sort((a, b) => a.timestamp - b.timestamp);
}

// --- AI OPERATIONS ---

async function generatePdfAnalysis(filename, text) {
  if (isMockAi) {
    console.log('[Mock AI] Generating analysis for:', filename);
    const mockSummary = `This document ("${filename}") is analyzed in Demo Mode because no GEMINI_API_KEY was supplied. The text contains approximately ${text.length} characters. From a preliminary check, the document outlines structural data, potential business or academic context, and information points relevant to its title.`;
    const mockTakeaways = [
      `The file "${filename}" is successfully uploaded and parsed.`,
      `The document is approximately ${(text.length / 1000).toFixed(1)} KB in raw text size.`,
      `Add your GEMINI_API_KEY in the backend .env configuration to get real Gen AI summarizations and takeaways.`
    ];
    return { summary: mockSummary, keyTakeaways: mockTakeaways };
  }

  try {
    console.log('[Gemini AI] Requesting analysis for:', filename);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are an expert document analyzer. Analyze the following text extracted from a PDF named "${filename}". 
Provide a concise 3-sentence summary of the document, and list exactly 3 key takeaways.
Return the result in JSON format with the following structure:
{
  "summary": "Your 3-sentence summary here...",
  "keyTakeaways": [
    "Takeaway 1",
    "Takeaway 2",
    "Takeaway 3"
  ]
}

Extracted Text:
${text.substring(0, 60000)}
`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);
    
    return {
      summary: parsedData.summary || 'Summary could not be generated.',
      keyTakeaways: parsedData.keyTakeaways || []
    };
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    return {
      summary: `Failed to generate AI analysis automatically. Error: ${error.message}`,
      keyTakeaways: ['AI key configuration error', 'API rate limit exceeded', 'Please try again later.']
    };
  }
}

async function getAiChatResponse(pdfText, history, userQuestion) {
  if (isMockAi) {
    console.log('[Mock AI] Generating Q&A reply for question:', userQuestion);
    return `[Demo Mode] You asked: "${userQuestion}". 
This is a mock answer since the Google Gemini API key is not configured. 
In a fully configured environment, Gemini would read the PDF text (which contains ${pdfText.length} characters) and answer your question accurately based on the content of the document. 
Please add GEMINI_API_KEY in the backend/.env file to run live inquiries.`;
  }

  try {
    console.log('[Gemini AI] Requesting chat answer...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const chatHistoryContext = history.map(h => {
      return `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.message}`;
    }).join('\n');

    const prompt = `You are an AI assistant analyzing a PDF document. You must answer the user's question using the text extracted from the document.
If the answer cannot be found in the document, use your general knowledge but state clearly that it is not explicitly mentioned in the PDF.

Document Content (Extracted Text):
--- START OF DOCUMENT ---
${pdfText.substring(0, 80000)}
--- END OF DOCUMENT ---

Chat History:
${chatHistoryContext}

Current Question:
User: ${userQuestion}
Assistant:`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error in AI Chat:', error);
    return `I encountered an error trying to process that question: ${error.message}`;
  }
}

// --- API ENDPOINTS ---

// Check Status API (for front-end indicators)
app.get('/api/status', (req, res) => {
  res.json({
    database: 'in-memory',
    geminiApi: isMockAi ? 'demo' : 'connected'
  });
});

// Upload PDF API
app.post('/api/pdfs/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file was provided.' });
    }

    console.log(`Processing uploaded file: ${req.file.originalname} (${req.file.size} bytes)`);

    // Parse the PDF text content
    let parsedPdf;
    try {
      parsedPdf = await pdfParse(req.file.buffer);
    } catch (parseErr) {
      console.error('Error parsing PDF binary:', parseErr);
      return res.status(400).json({ error: 'Failed to extract text from this PDF file. Make sure it is not encrypted or corrupted.' });
    }

    const text = parsedPdf.text || '';
    if (!text.trim()) {
      return res.status(400).json({ error: 'The PDF appears to be empty or contains no extractable text.' });
    }

    const pageCount = parsedPdf.numpages || 1;

    // Generate AI Summary and key takeaways
    const analysis = await generatePdfAnalysis(req.file.originalname, text);

    // Save in in-memory DB
    const pdfData = {
      filename: req.file.originalname,
      fileSize: req.file.size,
      pageCount: pageCount,
      extractedText: text,
      summary: analysis.summary,
      keyTakeaways: analysis.keyTakeaways
    };

    const savedPdf = await savePdfRecord(pdfData);

    res.status(201).json({
      message: 'PDF analyzed and saved successfully.',
      pdf: {
        id: savedPdf._id,
        filename: savedPdf.filename,
        fileSize: savedPdf.fileSize,
        pageCount: savedPdf.pageCount,
        summary: savedPdf.summary,
        keyTakeaways: savedPdf.keyTakeaways,
        uploadedAt: savedPdf.uploadedAt
      }
    });

  } catch (err) {
    console.error('Error handling upload:', err);
    res.status(500).json({ error: 'Server error processing PDF upload: ' + err.message });
  }
});

// List all PDFs API
app.get('/api/pdfs', async (req, res) => {
  try {
    const pdfs = await getAllPdfRecords();
    res.json(pdfs);
  } catch (err) {
    res.status(500).json({ error: 'Server error listing PDFs: ' + err.message });
  }
});

// Get detailed PDF API (with text and chat history)
app.get('/api/pdfs/:id', async (req, res) => {
  try {
    const pdf = await getPdfRecordById(req.params.id);
    const chats = await getChatHistory(req.params.id);
    res.json({
      pdf: {
        id: pdf._id,
        filename: pdf.filename,
        fileSize: pdf.fileSize,
        pageCount: pdf.pageCount,
        summary: pdf.summary,
        keyTakeaways: pdf.keyTakeaways,
        extractedText: pdf.extractedText,
        uploadedAt: pdf.uploadedAt
      },
      chats
    });
  } catch (err) {
    res.status(404).json({ error: 'PDF not found: ' + err.message });
  }
});

// Delete PDF API
app.delete('/api/pdfs/:id', async (req, res) => {
  try {
    const success = await deletePdfRecord(req.params.id);
    if (success) {
      res.json({ message: 'PDF deleted successfully.' });
    } else {
      res.status(404).json({ error: 'PDF not found to delete.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting PDF: ' + err.message });
  }
});

// Submit Q&A chat endpoint
app.post('/api/pdfs/:id/chat', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const pdf = await getPdfRecordById(req.params.id);
    
    // Save user's question first
    await saveChatRecord(req.params.id, 'user', question);

    // Retrieve previous history
    const history = await getChatHistory(req.params.id);

    // Generate AI response
    const answer = await getAiChatResponse(pdf.extractedText, history, question);

    // Save model's answer
    const savedAnswer = await saveChatRecord(req.params.id, 'model', answer);

    res.json({
      chat: savedAnswer
    });
  } catch (err) {
    console.error('Error in chat endpoint:', err);
    res.status(500).json({ error: 'Server error in Q&A: ' + err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`PDF Analyzer Server is running on port ${PORT} (In-Memory Database Mode)`);
});
