import db from '../db/index.js';
import { requestsTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { GoogleGenAI, Type } from "@google/genai";
import 'dotenv/config';

const apiKey = process.env.GEMINIAPIKEY;

if (!apiKey) {
  console.error('GEMINIAPIKEY environment variable is undefined.');
}

const ai = new GoogleGenAI({ apiKey });

const geminiResponse = async (request) => {
  if (!request) {
    throw new Error('Request text is required');
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ parts: [{ text: request }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              response: {
                type: Type.ARRAY,
              },
            },
            propertyOrdering: ["response"],
          },
        },
      },
    });

    const responseText = response.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      return {};
    }
    const jsonResponse = JSON.parse(responseText);
    return jsonResponse;

  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw error;
  }
};

const createRequest = async (req, res) => {
  const { request: requestText } = req.body;

  try {
    const aiResponse = await geminiResponse(requestText);

    await db
      .insert(requestsTable)
      .values({ request: requestText, responseJson: JSON.stringify(aiResponse) }); 
    console.log('New request created!');
    return res.status(200).json({ message: 'Request created successfully', data: aiResponse });
  } catch (error) {
    console.error('Error processing request:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getRequests = async function () {
  try {
    const requests = await db
      .select()
      .from(requestsTable);

    if (!requests || requests.length === 0) {
      return res.status(404).json({ error: `No requests found` });
    }

    res.status(200).json({
      message: 'Requests retrieved',
      data: requests.map(request => ({
        id: request.id,
        originalRequest: request.request,
        structuredResponse: request.responseJson, 
        createdAt: request.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching requests:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getRequest = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  const idNum = parseInt(id, 10);
  if (isNaN(idNum) || idNum <= 0) {
    return res.status(400).json({ error: 'Invalid ID: must be a positive integer' });
  }

  try {
    // Fetch the request from the database
    const [request] = await db
      .select()
      .from(requestsTable)
      .where(eq(requestsTable.id, idNum));

    if (!request) {
      return res.status(404).json({ error: `Request with ID ${idNum} not found` });
    }

    res.status(200).json({
      message: 'Request retrieved',
      data: {
        id: request.id,
        originalRequest: request.request,
        structuredResponse: request.responseJson, 
        createdAt: request.createdAt,
      },
    });
  } catch (error) {
    console.error(`Error fetching request ID ${idNum}:`, error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export {
  createRequest,
  getRequests,
  getRequest
};
