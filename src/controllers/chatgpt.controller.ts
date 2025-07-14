import { Request, Response } from "express";
import { ChatGPTRequestBody } from "../../types/payload";
import { ChatGPTResponse } from "../../types/chatGPT";
import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "../../utils/jwt";


const prisma = new PrismaClient()




export const chatGPTController = async (
  req: Request<{}, {}, ChatGPTRequestBody>,
  res: Response
) => {
  const { productTitle, form, totalWeight, nutriInfoPerGram } = req.body;

  const authHeader = req.headers.authorization

  //TODO if(!autherHeather)

  const token = authHeader.split(" ")[1]

  const decoded = await verifyJWT(token)

  //TODO if(!decode)

  const userId = decoded.userId

  // const  Object.keys(form)

  const cleanForm = form.filter(nut => nut.amount !== "" )
   
  
  const stringedForm = cleanForm.map(
    (nut) => `${nut.name}: ${nut.amount + nut.unit}`
  );

  //   const prompt = `Kan du utvärdera om följande livsmedelsprodukt är hälsosam eller inte? Här är informationen:
  // - Produktnamn: ${productTitle}
  // - Ingredienser: ${stringedForm}
  // - Total vikt: ${totalWeight} gram
  // - Näringsinnehåll per gram: ${nutriInfoPerGram}

  // Motivera gärna svaret utifrån ingredienser och näringsvärden.`;

  const prompt = `Hej, kan du snälla berätta om den här produkten är nyttig? Information om produkten: 
  - Produktnamn: ${productTitle}
- Ingredienser: ${stringedForm}
- Total vikt: ${totalWeight} gram
- Näringsinnehåll per gram: ${nutriInfoPerGram}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data: ChatGPTResponse = await response.json();
    console.log("chatgptController, ChatGPTResponse: ", data);

    const reply: string = data.choices?.[0]?.message?.content

    if (reply) {
      await prisma.chatGPTRes.create({ 
        data: {
          productTitle,
          chatGPTRes: reply,
          user: {
            connect: { id: userId }
          }
        }
      })
    }

    res
      .status(200)
      .json({ reply: reply || "No response" });
  } catch (error) {
    console.error("Error in chatgptController:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
