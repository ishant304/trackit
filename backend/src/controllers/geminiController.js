import { createUserContent, GoogleGenAI } from "@google/genai"
import z from "zod";
import { geminiSchema } from "../models/geminiSchema.js";
import XLSX from "xlsx";

export const geminiResponse = async (req, resp) => {

    const AllowedMimeType = ["application/pdf",
        "image/png",
        "image/jpeg",
        "image/webp",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv"]

    const textMimeType = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv"
    ]

    if (!req.file) {
        return resp.status(404).json({
            message: "File not Found"
        })
    }

    if (!AllowedMimeType.includes(req.file.mimetype)) {
        return resp.status(400).json({
            message: "File type not supported"
        })
    }

    if (textMimeType.includes(req.file.mimetype)) {

        try {

            const workbook = XLSX.read(req.file.buffer)

            const worksheet = workbook.Sheets[workbook.SheetNames[0]]

            const json = XLSX.utils.sheet_to_json(worksheet);

            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

            const response = await ai.models.generateContent({
                model: "gemini-3.1-flash-lite",
                contents: `Parse the bank statement. Extract only debited transcation. If no proper field is given then read the given values as amount, date, transaction detail. Also look for header row that tell what does each column identifier maps to and then parse the following. Return success false and empty array if no valid transactions found.
                DATA :  ${JSON.stringify(json)}`,
                config: {
                    responseJsonSchema: z.toJSONSchema(geminiSchema),
                    responseMimeType: "application/json"
                }
            });


            const data = JSON.parse(response.text)
            return resp.status(200).json(data)


        }
        catch (err) {
            return resp.status(500).json({ message: "Failed to process document " })
        }

    }

    else {

        try {

            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

            const response = await ai.models.generateContent({
                model: "gemini-3.1-flash-lite",
                contents: [
                    createUserContent([
                        "Parse the bank statement. Extract only debited transactions. If any critical field is missing return success false and empty array.",
                        {
                            inlineData: {
                                mimeType: req.file.mimetype,
                                data: req.file.buffer.toString("base64")
                            }
                        }
                    ])
                ],
                config: {
                    responseJsonSchema: z.toJSONSchema(geminiSchema),
                    responseMimeType: "application/json"
                }
            });


            const data = JSON.parse(response.text)
            return resp.status(200).json(data)

        }
        catch (err) {
            return resp.status(500).json({ message: "Failed to process document " })
        }

    }

}

