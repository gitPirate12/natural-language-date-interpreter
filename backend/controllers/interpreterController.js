import { db } from "../db/index.js";
import { requestsTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GEMINIAPIKEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

if (!apiKey) {
  console.error("GEMINIAPIKEY environment variable is undefined.");
}

const geminiResponse = async (request) => {
  if (!request) {
    throw new Error("Request text is required");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${request}`,
    });
    console.log(response.text);

    const text = response.text;
    const cleanedText = text
      .replace(/\*\s*/g, "") // Remove asterisks
      .replace(/\$\\boxed\{[^}]*\}\$/g, "") // Remove \\boxed{...}
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/\*\*/g, "") // Remove Markdown bold
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();

    return cleanedText;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    throw error;
  }
};
const createRequest = async (req, res) => {
  const { request } = req.body;
  const date = new Date();

  const requestText = `interpret natural language date expressions(phrases) like "next Tuesday" or "three weeks from now" into actual calendar dates and return only the actual calendar dates no other text.Todays date is ${date} + ${request}`;
  try {
    const aiResponse = await geminiResponse(requestText);

    await db
      .insert(requestsTable)
      .values({ request, response: JSON.stringify(aiResponse) });
    console.log("New request created!");
    return res.status(200).json({ date: aiResponse, request: request });
  } catch (error) {
    console.error("Error processing request:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await db.select().from(requestsTable);

    if (!requests || requests.length === 0) {
      return res.status(404).json({ error: `No requests found` });
    }

    res.status(200).json({
      message: "Requests retrieved",
      data: requests.map((request) => ({
        id: request.id,
        originalRequest: request.request,
        structuredResponse: request.response,
        createdAt: request.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching requests:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getRequest = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  const idNum = parseInt(id, 10);
  if (isNaN(idNum) || idNum <= 0) {
    return res
      .status(400)
      .json({ error: "Invalid ID: must be a positive integer" });
  }

  try {
    // Fetch the request from the database
    const [request] = await db
      .select()
      .from(requestsTable)
      .where(eq(requestsTable.id, idNum));

    if (!request) {
      return res
        .status(404)
        .json({ error: `Request with ID ${idNum} not found` });
    }

    res.status(200).json({
      message: "Request retrieved",
      data: {
        id: request.id,
        originalRequest: request.request,
        structuredResponse: request.response,
        createdAt: request.createdAt,
      },
    });
  } catch (error) {
    console.error(`Error fetching request ID ${idNum}:`, error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { createRequest, getRequests, getRequest };
