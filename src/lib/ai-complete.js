// Define functions for AI tools
import aiTools from "./ai-tools.js";
import { OpenAI } from "openai";

// Main function to run conversation with OpenAI
async function complete({ input, context, model = "gpt-4o", tools }) {
  const openai = new OpenAI();
  const startTime = Date.now(); // Start time
  context.appendMessage({
    role: "user",
    content: input,
  });

  console.info(`${context.messages.length} starting complete...`);
  let response = await openai.chat.completions.create({
    model,
    messages: context.messages,
    tools: tools,
    tool_choice: "auto",
  });

  console.info("got response...");
  while (response.choices[0].message.tool_calls) {
    const responseMessage = response.choices[0].message;
    context.appendMessage(responseMessage);
    for (const toolCall of responseMessage.tool_calls) {
      try {
        const functionName = toolCall.function.name;
        const functionToCall = aiTools[functionName].function;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        console.info(
          `${context.messages.length} starting tool call ${functionName}`
        );
        try {
          const functionResponse = await functionToCall(functionArgs, context);
          context.appendMessage({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: JSON.stringify(functionResponse),
          });
        } catch (error) {
          console.error(error);
          context.appendMessage({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: `Error: ${JSON.stringify(error)}`,
          });
        }
        context.totalToolCalls += 1;
        console.info(
          `${context.messages.length} finished tool call ${functionName}`
        );
      } catch (e) {
        console.error("failed tool call", toolCall);
      }
    }
    console.info(`${context.messages.length} starting tools response...`);
    response = await openai.chat.completions.create({
      model,
      messages: context.messages,
      tools: tools,
      tool_choice: "auto",
    });
    console.info(`got tools response...`);
  }
  const endTime = Date.now(); // End time
  const duration = (endTime - startTime) / 1000; // Duration in seconds

  const finalMessage = response.choices[0].message;
  context.appendMessage(finalMessage);
  return { response: finalMessage, duration };
}

export { complete };
