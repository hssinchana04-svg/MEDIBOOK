import { GoogleGenerativeAI } from "@google/generative-ai"
import doctorModel from "../models/doctorModel.js"
import fs from "fs"

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Helper to extract JSON from Gemini text response
function extractJSON(text) {
    try {
        let cleanText = text.trim()
        if (cleanText.startsWith("```json")) {
            cleanText = cleanText.substring(7)
        } else if (cleanText.startsWith("```")) {
            cleanText = cleanText.substring(3)
        }
        if (cleanText.endsWith("```")) {
            cleanText = cleanText.substring(0, cleanText.length - 3)
        }
        return JSON.parse(cleanText.trim())
    } catch (error) {
        console.error("JSON Parsing failed for text:", text)
        const match = text.match(/\{[\s\S]*\}/)
        if (match) {
            try {
                return JSON.parse(match[0])
            } catch (innerError) {
                throw new Error("Could not parse AI response as JSON")
            }
        }
        throw new Error("Invalid AI response format")
    }
}

// Helper to convert multer file to generative part (base64)
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        }
    }
}

// List of models to try in order of preference
const MODELS = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-pro", "gemini-1.5-flash"]

// Helper to call generateContent with automatic model fallback
async function generateContentWithFallback(promptOrParts) {
    let lastError = null
    for (const modelName of MODELS) {
        try {
            console.log(`[AI] Attempting generateContent with: ${modelName}`)
            const model = genAI.getGenerativeModel({ model: modelName })
            const result = await model.generateContent(promptOrParts)
            return result
        } catch (error) {
            console.warn(`[AI] Model ${modelName} failed generateContent:`, error.message)
            lastError = error
        }
    }
    throw lastError || new Error("All Gemini models failed to generate content.")
}

// Helper to call startChat with automatic model fallback
async function chatWithFallback(message, history, systemInstruction) {
    let lastError = null
    for (const modelName of MODELS) {
        try {
            console.log(`[AI] Attempting chat with: ${modelName}`)
            const model = genAI.getGenerativeModel({ model: modelName, systemInstruction })
            
            const formattedHistory = (history || []).map(msg => ({
                role: msg.sender === "user" ? "user" : "model",
                parts: [{ text: msg.text }]
            }))

            const chat = model.startChat({
                history: formattedHistory
            })

            const result = await chat.sendMessage(message)
            return result.response.text()
        } catch (error) {
            console.warn(`[AI] Model ${modelName} failed chat:`, error.message)
            lastError = error
        }
    }
    throw lastError || new Error("All Gemini models failed to process chat message.")
}

// 1. Symptom Checker Endpoint
const symptomCheck = async (req, res) => {
    try {
        const { symptoms } = req.body
        if (!symptoms) {
            return res.json({ success: false, message: "Please provide symptom details." })
        }

        const prompt = `You are a professional medical triage AI embedded in the healthcare application MEDIBOOK.
Your task is to analyze the user's symptoms and suggest the most appropriate medical specialty from this exact list:
- "General physician"
- "Gynecologist"
- "Dermatologist"
- "Pediatricians"
- "Neurologist"
- "Gastroenterologist"

User symptoms description: "${symptoms}"

Analyze the symptoms, suggest the specialty, identify the urgency, and explain why.
Provide your response in valid JSON format. Return ONLY the JSON object, do not wrap it in any Markdown code blocks or add any other text.
The JSON must follow this exact schema:
{
  "speciality": "The exact specialty string from the list above",
  "urgency": "Low" | "Medium" | "High" | "Emergency",
  "explanation": "A brief explanation of why this specialist is suggested, symptoms to watch, and a standard medical disclaimer."
}`

        const result = await generateContentWithFallback(prompt)
        const responseText = result.response.text()
        
        const aiData = extractJSON(responseText)

        // Find available doctors in the suggested speciality from database
        const doctors = await doctorModel.find({ speciality: aiData.speciality }).select("-password")

        res.json({
            success: true,
            aiData,
            doctors
        })

    } catch (error) {
        console.error("Symptom Check Error:", error)
        res.json({ success: false, message: error.message })
    }
}

// 2. AI Health Chatbot Endpoint
const healthChat = async (req, res) => {
    try {
        const { message, history } = req.body
        if (!message) {
            return res.json({ success: false, message: "Please provide a message." })
        }

        const systemInstruction = `You are a helpful, professional AI Health Chatbot inside the MEDIBOOK healthcare booking application.
Provide clear, informative, and empathetic answers to the user's health-related questions.
You must always follow these rules:
1. Provide general educational information about health, wellness, and medical questions.
2. Under no circumstances diagnose conditions definitively or prescribe treatments.
3. Always include a brief disclaimer at the end of your response reminding the user that this is for informational purposes and they should consult a doctor for personalized advice.
4. If appropriate, suggest they visit one of MEDIBOOK's specialities: "General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist".
5. Keep your responses structured (using bullet points where appropriate) and concise (around 100-150 words).`

        const reply = await chatWithFallback(message, history, systemInstruction)

        res.json({
            success: true,
            reply
        })

    } catch (error) {
        console.error("Health Chat Error:", error)
        res.json({ success: false, message: error.message })
    }
}

// 3. Prescription Scanner Endpoint
const scanPrescription = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "Please upload a prescription image file." })
        }

        const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype)

        const prompt = `You are an AI prescription scanning assistant. Analyze this prescription image.
Perform optical character recognition (OCR) and identify all medicines listed.
For each medicine, extract:
- Name: Brand name or generic name
- Dosage: Strength (e.g. 500mg, 10mg, or as listed)
- Frequency: Timing instructions (e.g. Once daily, twice daily after food, or as listed)
- Purpose: Typical indication/purpose (e.g. Fever, Pain Relief, Antibiotic, Blood Pressure)

Return your findings in valid JSON format. Return ONLY the JSON object, do not wrap it in any Markdown code blocks or add any other text.
The JSON must follow this exact schema:
{
  "success": true,
  "medicines": [
    {
      "name": "Medicine Name",
      "dosage": "Dosage/Strength",
      "frequency": "Frequency/Instructions",
      "purpose": "Common Purpose/Indication"
    }
  ]
}
If the image does not seem to be a prescription, or if no medicines can be identified, return:
{
  "success": false,
  "medicines": [],
  "message": "Could not identify any medicines in the uploaded image. Please ensure you upload a clear image of a prescription."
}`

        const result = await generateContentWithFallback([imagePart, prompt])
        const responseText = result.response.text()

        const data = extractJSON(responseText)
        res.json(data)

    } catch (error) {
        console.error("Prescription Scanner Error:", error)
        res.json({ success: false, message: error.message })
    } finally {
        // Clean up the uploaded file to prevent disk clutter
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path)
            } catch (unlinkErr) {
                console.error("Failed to delete temp file:", unlinkErr)
            }
        }
    }
}

export { symptomCheck, healthChat, scanPrescription }
