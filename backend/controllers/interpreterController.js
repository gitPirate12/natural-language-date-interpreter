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
  console.log("geminiResponse - Start", { request }); // Log input
  if (!request) {
    const error = new Error("Request text is required");
    console.error("geminiResponse - Error: Request text is required", error);
    throw error;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${request}`,
    });
    console.log("geminiResponse - Gemini API Response:", response); // Log full response
    console.log("geminiResponse - response.text:", response.text);

    const text = response.text;
    const cleanedText = text
      .replace(/\*\s*/g, "") // Remove asterisks
      .replace(/\$\\boxed\{[^}]*\}\$/g, "") // Remove \\boxed{...}
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/\*\*/g, "") // Remove Markdown bold
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();

    console.log("geminiResponse - Cleaned text:", cleanedText); // Log cleaned text
    return cleanedText;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    throw error;
  }
};

const createRequest = async (req, res) => {
  console.log("createRequest - Start", { body: req.body }); // Log input
  const { request } = req.body;
  const date = new Date();
  const requestText = `Interpret the following phrase as a natural language date expression. If a date can be reasonably inferred, return ONLY the calculated date in YYYY-MM-DD format. If no date can be inferred, return the exact message: "Error: Your request has nothing to do with dates." Today's date is ${date.toISOString().split('T')[0]}. Phrase: "${request}"`;
  console.log("createRequest - requestText:", requestText);

  try {
    const aiResponse = await geminiResponse(requestText);
    console.log("createRequest - aiResponse:", aiResponse); // Log aiResponse

    const insertResult = await db
      .insert(requestsTable)
      .values({ request, response: JSON.stringify(aiResponse) });
    console.log("createRequest - db insert result:", insertResult); //log db insert result

    console.log("New request created!");
    return res.status(200).json({ date: aiResponse, request: request });
  } catch (error) {
    console.error("Error processing request:", error); // Log full error
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getRequests = async (req, res) => {
  console.log("getRequests - Start");
  try {
    const requests = await db.select().from(requestsTable);
    console.log("getRequests - db select result:", requests); // Log db result

    if (!requests || requests.length === 0) {
      console.log("getRequests - No requests found");
      return res.status(404).json({ error: `No requests found` });
    }

    const formattedRequests = requests.map((request) => ({
      id: request.id,
      originalRequest: request.request,
      structuredResponse: request.response,
      createdAt: request.createdAt,
    }));
    console.log("getRequests - formattedRequests:", formattedRequests);
    res.status(200).json({
      message: "Requests retrieved",
      data: formattedRequests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error); // Log full error
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getRequest = async (req, res) => {
  console.log("getRequest - Start", { params: req.params }); // Log input
  const { id } = req.params;

  // Validate ID
  const idNum = parseInt(id, 10);
  console.log("getRequest - idNum:", idNum);
  if (isNaN(idNum) || idNum <= 0) {
    console.error("getRequest - Invalid ID:", id);
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
    console.log("getRequest - db select result:", request); // Log db result

    if (!request) {
      console.log(`getRequest - Request with ID ${idNum} not found`);
      return res
        .status(404)
        .json({ error: `Request with ID ${idNum} not found` });
    }

    const formattedRequest = {
      id: request.id,
      originalRequest: request.request,
      structuredResponse: request.response,
      createdAt: request.createdAt,
    };
    console.log("getRequest - formattedRequest:", formattedRequest);
    res.status(200).json({
      message: "Request retrieved",
      data: formattedRequest,
    });
  } catch (error) {
    console.error(`Error fetching request ID ${idNum}:`, error); // Log full error
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { createRequest, getRequests, getRequest };
