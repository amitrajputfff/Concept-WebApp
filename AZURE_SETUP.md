# Azure OpenAI Setup Instructions

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT=your-deployment-name-here
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

## Where to Find Your Credentials

1. **AZURE_OPENAI_ENDPOINT**: Your Azure OpenAI resource endpoint URL
2. **AZURE_OPENAI_API_KEY**: API key from Azure portal
3. **AZURE_OPENAI_DEPLOYMENT**: The deployment name you created for your model
4. **AZURE_OPENAI_API_VERSION**: API version (default: 2024-02-15-preview)

## Testing

After adding credentials, restart the development server:
```bash
npm run dev
```

