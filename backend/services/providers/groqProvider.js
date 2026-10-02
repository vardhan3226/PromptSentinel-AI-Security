import "dotenv/config";

/*
|--------------------------------------------------------------------------
| GROQ PROVIDER
|--------------------------------------------------------------------------
|
| This file contains only Groq-specific communication.
|
| The main AI Hub service is responsible for:
|
| - system instructions
| - response styles
| - conversation handling
| - provider selection
|
| This provider is responsible only for:
|
| - Groq API configuration
| - Groq API request
| - Groq response parsing
|
|--------------------------------------------------------------------------
*/

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const GROQ_MODEL =
  process.env.GROQ_MODEL ||
  "openai/gpt-oss-20b";

const GROQ_URL =
  "https://api.groq.com/openai/v1/chat/completions";

/*
|--------------------------------------------------------------------------
| GENERATE RESPONSE USING GROQ
|--------------------------------------------------------------------------
*/

export const generateGroqResponse = async ({
  messages,
}) => {
  /*
  |--------------------------------------------------------------------------
  | VALIDATE API KEY
  |--------------------------------------------------------------------------
  */

  if (!GROQ_API_KEY) {
    throw new Error(
      "GROQ_API_KEY is not configured."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | VALIDATE MESSAGES
  |--------------------------------------------------------------------------
  */

  if (
    !Array.isArray(messages) ||
    messages.length === 0
  ) {
    throw new Error(
      "Valid AI messages are required."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | GROQ REQUEST
  |--------------------------------------------------------------------------
  */

  const response = await fetch(
    GROQ_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${GROQ_API_KEY}`,
      },

      body: JSON.stringify({
        model: GROQ_MODEL,

        /*
        |--------------------------------------------------------------------------
        | RESPONSE CREATIVITY
        |--------------------------------------------------------------------------
        |
        | Moderate creativity gives natural responses
        | without making the answer engine unnecessarily random.
        |
        */

        temperature: 0.4,

        /*
        |--------------------------------------------------------------------------
        | MAXIMUM RESPONSE LENGTH
        |--------------------------------------------------------------------------
        */

        max_completion_tokens: 1800,

        /*
        |--------------------------------------------------------------------------
        | REASONING
        |--------------------------------------------------------------------------
        |
        | Reasoning output is not required by the AI Hub frontend.
        |
        */

        include_reasoning: false,

        messages,
      }),
    }
  );

  /*
  |--------------------------------------------------------------------------
  | PARSE PROVIDER RESPONSE
  |--------------------------------------------------------------------------
  */

  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error(
      "Invalid response received from Groq."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | HANDLE PROVIDER ERROR
  |--------------------------------------------------------------------------
  */

  if (!response.ok) {
    const providerMessage =
      data?.error?.message ||
      data?.message ||
      "Groq provider request failed.";

    throw new Error(
      providerMessage
    );
  }

  /*
  |--------------------------------------------------------------------------
  | EXTRACT ANSWER
  |--------------------------------------------------------------------------
  */

  const content =
    data?.choices?.[0]?.message?.content;

  if (
    typeof content !== "string" ||
    !content.trim()
  ) {
    throw new Error(
      "Groq provider returned an empty response."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RETURN PROVIDER RESULT
  |--------------------------------------------------------------------------
  */

  return {
    provider: "Groq",

    model: GROQ_MODEL,

    response:
      content.trim(),
  };
};