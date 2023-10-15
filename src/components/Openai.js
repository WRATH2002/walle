import { API_KEY } from "../utils/constants";

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});
export async function sendMessageToOpenAI(message) {
  const completion = await openai.completions.create({
    model: "text-davinci-003",
    prompt: message,
    max_tokens: 256,
  });

  return completion.choices[0].text;
}
