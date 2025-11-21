# Chatgpt Challenge
The goal of this challenge is to create a "chatGPT-like" application. Choose the languages and frameworks you like best and provide an MVP.

## Approach
The implemented approach is quite straight forward. As my experience building LLMs is limited, and so is the time for the challenge, I made a Node backend app and its corrisponding frontend. Both applications are bundled together in the same main project folder for simplicity. 

The backend uses API endpoints and its corresponding API Key to query [`groq`](https://groq.com/), following their [documentation guides](https://console.groq.com/docs/api-reference#chat-create). I didn't use their library since the same result can be achieved using `fetch`, and it does not require the same learning curve and research level.

## How to run it?
To run the prohject locally, we need to run both applications separately.

### Node backend setup
Create a `.env` file in the `/server` folder with the following variables:
```
GROQ_API_KEY=your_groq_api_key
GROQ_API_ENDPOINT=https://api.groq.com/openai/v1
```

Install dependencies and run server
```
npm install
node server.js
```

The server should be running and listening locally on port `3000`

### Vue frontend
Create a `.env` file in the `/src` folder of the project:
```
VITE_API_ENDPOINT=http://localhost:3000
```

```
npm install
npm run dev
```