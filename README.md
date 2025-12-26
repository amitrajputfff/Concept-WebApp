# Propel Capital Demo Application

> **Proactive Lending Intelligence Platform** - AI-powered lending that anticipates merchant needs.

## 🎯 Overview

This is a high-fidelity demo showcasing a revolutionary lending platform that transforms Mastercard from an infrastructure provider into a **Merchant Growth Partner**. The platform uses real-time transaction intelligence and AI to proactively offer working capital when merchants need it most.

## ✨ Key Features

### 🏦 Lender Dashboard (Admin View)
- **Opportunity Radar**: Real-time monitoring of merchant opportunities
- **Parse.AI Analysis**: Comprehensive risk assessment with visual insights
- **Revenue Projections**: Interactive charts showing funding impact
- **Azure AI Risk Memos**: AI-generated credit underwriter assessments
- **Context Modal**: Explains the business opportunity and strategy

### 📱 Mobile App (Merchant View)
- **Simulated iPhone Experience**: Authentic mobile interface in a phone frame
- **Intelligent Notifications**: Proactive alerts for inventory risks
- **AI Chat Agent (Clara)**: Conversational interface for loan approval
- **Instant Funding**: One-tap approval with immediate transfer
- **Azure AI Assistance**: Real-time explanations and support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Azure OpenAI access with credentials

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Azure OpenAI

Create a `.env.local` file in the root directory:

```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT=your-deployment-name-here
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

See `AZURE_SETUP.md` for detailed instructions.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Demo Flow

### Login Options

You'll see a beautiful login page with two role options:

1. **Jane Doe (Lender)** - Access the admin dashboard
2. **Maria (Merchant)** - Experience the mobile app

### Lender Dashboard Journey

1. **Login as Jane Doe** → View the Opportunity Radar
2. **Click "Context"** → Learn about the business opportunity
3. **Select "Taco Rico"** → View detailed Parse.AI analysis
4. **Click "Generate Risk Memo"** → Watch Azure AI create a professional assessment
5. **Review Charts & Metrics** → See the 280% revenue spike projection

### Mobile App Journey

1. **Login as Maria** → See the mobile home screen
2. **Click the Game Day Alert** → Enter chat with Clara
3. **Follow the Conversation** → Click reply buttons to advance
4. **Click the Sparkles Icon** → Ask Clara for AI-powered help
5. **Accept the Offer** → Watch the instant transfer complete

## 🎨 Design System

- **Primary Color**: Teal-600 (`#0d9488`) - Trust & Growth
- **Accent Color**: Emerald-500 - Revenue & Success
- **UI Framework**: shadcn/ui (New York style)
- **Components**: 40+ pre-built shadcn components
- **Typography**: Geist Sans & Geist Mono fonts

## 🏗️ Architecture

```
app/
├── login/          # Role selection page
├── dashboard/      # Lender admin view
├── mobile/         # Merchant mobile experience
├── api/ai/         # Azure OpenAI proxy endpoint
└── layout.tsx      # Root layout with providers

lib/
├── auth-context.tsx  # Mock authentication
└── ai.ts            # Azure AI helper functions
```

## 🔧 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Azure OpenAI
- **Notifications**: Sonner (toast)

## 📊 Demo Scenario

**Business**: Taco Rico (Austin, TX)  
**Date**: Wednesday, Sept 15  
**Event**: Big Game on Saturday, Sept 18

**The Problem**:
- Inventory (Wings): 40% (Low)
- Bank Balance: $30,000
- Upcoming Obligations: $33,000
- Predicted Demand Spike: 280%
- Revenue at Risk: $12,000+

**The Solution**:
- Loan Amount: $30,000
- Repayment: 8% of daily sales
- Duration: ~12 weeks
- ROI: 400%

## 🎯 Key Differentiators

1. **Proactive Intelligence** - Detects opportunities before merchants realize them
2. **Context-Aware** - Understands events, seasons, and merchant history
3. **Flexible Repayment** - Daily sales percentage, not fixed payments
4. **Instant Approval** - One-tap funding in minutes
5. **AI-Powered** - Azure OpenAI for risk analysis and merchant support

## 🧪 Testing

The application includes:
- ✅ Protected routes with role-based access
- ✅ Mock authentication (no backend needed)
- ✅ AI fallback responses (works without Azure OpenAI)
- ✅ Responsive design (mobile & desktop)
- ✅ Error handling and loading states

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AZURE_OPENAI_ENDPOINT` | Your Azure OpenAI resource URL | Yes |
| `AZURE_OPENAI_API_KEY` | API authentication key | Yes |
| `AZURE_OPENAI_DEPLOYMENT` | Model deployment name | Yes |
| `AZURE_OPENAI_API_VERSION` | API version (default: 2024-02-15-preview) | No |
| `ELEVENLABS_API_KEY` | ElevenLabs API key for text-to-speech | Yes (for voice features) |
| `ELEVENLABS_VOICE_ID` | ElevenLabs voice ID (default: Rachel) | No |

## 🎨 Component Library

All shadcn/ui components are pre-installed:
- Cards, Buttons, Badges, Dialogs
- Sheets, ScrollAreas, Skeletons
- Charts, Avatars, Separators
- Toast notifications (Sonner)

## 🔒 Security Notes

- Environment variables are never exposed to the client
- Azure OpenAI calls are proxied through `/api/ai`
- No actual authentication or database (demo only)
- All user data is stored in localStorage

## 📱 Browser Support

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

Ready to deploy to Vercel:

```bash
npm run build
npm start
```

Remember to add environment variables in your hosting platform's settings.

## 📖 Additional Documentation

- `Document.md` - Original project specification
- `AZURE_SETUP.md` - Detailed Azure OpenAI setup
- Component docs: [shadcn/ui](https://ui.shadcn.com)

## 💡 Demo Tips

1. **Start with Context** - Click "Context" in the dashboard to understand the pitch
2. **Try AI Features** - Generate risk memos and ask Clara for help
3. **Watch the Flow** - Follow the complete journey from detection to funding
4. **Check Responsiveness** - Test on different screen sizes
5. **Explore Details** - Hover over elements to see polish and interactions

## 🎬 Presentation Mode

For demos:
1. Start at `/login` - Show both login options
2. Demo **Lender View** first (context → analysis → AI memo)
3. Logout and demo **Mobile View** (home → chat → AI help → success)
4. Explain the business opportunity and technical architecture

## 🤝 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service)

---

**Questions?** Check `Document.md` for the complete project specification and scenario details.
