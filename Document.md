# Project Handover: **Propel Capital** Demo Application

---

## 1. Project Overview

**Objective**  
Build a high-fidelity **“Vibe Coded”** prototype to pitch a new lending ecosystem to **Mastercard**.

**Concept**  
**Propel Capital** is a **Proactive Lending Platform**. Instead of waiting for loan applications, the system detects revenue opportunities (e.g., a “Game Day” event) and pushes a **pre-approved working capital offer** to the merchant.

**Ecosystem**
- **LiaPlus AI (Frontend / Experience)**  
  Acts as the *Relationship Manager* & *CFO* agent (**“Clara”**) via voice/chat.
- **Parse.AI (Backend / Intelligence)**  
  Data ingestion (Plaid / Square), underwriting, knowledge graphs, opportunity detection.
- **Employees 1st**  
  Strategic capital provider and orchestration layer.

---

## 2. User Journey (The “Maria” Scenario)

The demo follows a narrative for **Maria**, a pizza shop owner in **Arizona**.

1. **Trigger**  
   Parse.AI detects the upcoming **Arizona Championship Game** and identifies that Maria stocked out during the last big game (Sept 6), losing **~$6k revenue**.
2. **Admin View**  
   The lender sees this insight on the dashboard.
3. **Outreach**  
   The AI agent **Clara** sends a push notification to Maria.
4. **Offer**  
   Clara offers **$30,000 instantly** to stock up on inventory.
5. **Terms**  
   - Total repayment: **$32,400**  
   - Repayment model: **8% of daily sales** (flexible, not a fixed monthly bill)
6. **Result**  
   Maria accepts via chat and funds are transferred instantly.

---

## 3. Technical Implementation Details

**Current State**  
Single-file React application: `PropelDemoApp.jsx` using Tailwind CSS.

### Tech Stack
- **Framework:** React  
- **Styling:** Tailwind CSS (utility-first)  
- **Icons:** lucide-react  
- **Charts:** recharts (AreaChart / LineChart)  
- **AI Integration:** Google Gemini API (`gemini-2.5-flash-preview`)

### Architecture
- Uses a `currentView` state to toggle between two interfaces in the same DOM:
  - **LenderDashboard** – Desktop admin panel
  - **MobileView** – Simulated iPhone borrower experience

---

## 4. Key Features & Logic

### A. Lender Dashboard (Admin View)

**Visual Style**  
Modern & growth-oriented (Teals, Emeralds, Clean White).

**Data Visualization**
- Recharts area chart comparing:
  - *Standard Revenue*
  - *Projected Revenue with Funding*

**Intelligence Display**
- Parse.AI Analysis:
  - Risk Score: **92**
  - Projected Upside: **$14.5k**
  - Contextual Memory: Historical stock-out data

**Gemini Feature – “Generate Risk Memo”**
- Sends mock data (Score 92, purpose, financials) to Gemini
- Outputs a concise, professional **credit underwriter memo** in real time

---

### B. Borrower Mobile App (Maria’s View)

**Visual Style**  
Mobile-first, consumer-grade fintech UX.

**Home Screen**
- “Good Morning, Maria” header
- Notification card for **Arizona Championship Weekend**

**Chat Interface**
- Scripted conversation (`chatScript` array)
- Simulated typing delays using `setTimeout`
- User advances demo via predefined **Reply** buttons

**Gemini Feature – “Sparkles” (AI Help)**
- Triggered if Maria hesitates on the **8% daily split**
- Gemini generates an empathetic explanation of why:
  - **8% of daily sales** is safer than a fixed loan
  - Emphasizes flexibility during slow days

---

## 5. Design Specifications (The “Vibe”)

- **Primary Colors**
  - Teal-600 `#0d9488`
  - Emerald-500 `#10b981`
  - Slate-900 (Sidebar)
- **AI Persona:** *Clara*
- **Tone:** Empathetic CFO (human, not robotic)
- **Key Phrase:**  
  > “It flexes with you. On slow Tuesdays, you pay almost nothing.”

---

## 6. Developer Action Items

1. **API Key**
   - `generateGeminiContent` currently has an empty `apiKey`
   - Populate with a valid **Google Gemini API key** at runtime
2. **State Management**
   - Ensure `chatScript` supports dynamic insertion of Gemini responses
   - Must not break index flow (currently handled in `MobileView`)
3. **Responsiveness**
   - `MobileView` is hardcoded to **375px**
   - Ensure proper scaling on smaller presentation screens

---



# Propel Capital Demo Application

---

## 1. Executive Summary & Strategic Context

**Objective**  
Build a high-fidelity **“Vibe Coded”** prototype to pitch a new lending ecosystem to **Mastercard executives**.

**The Pitch**  
Lending shouldn’t be something merchants seek out. It should be **intelligent and proactive**.  
By leveraging real-time transaction data (POS, IoT, Inventory), Mastercard evolves from an infrastructure provider into a **Merchant Growth Partner**.

**Core Value Proposition**
- **Proactive:** Anticipates merchant needs before they’re obvious  
- **Real-Time:** One-tap approval, funds in minutes  
- **Stickiness:** Deep merchant loyalty and a strong competitive moat  

---

## 2. Demo Narrative: **“Taco Rico”**

A data-rich story featuring **Maria**, owner of **Taco Rico**, a family-run Mexican restaurant in **Austin, TX**.

### Scenario Timeline
- **Trigger Date:** Wednesday, Sept 15 (9:15 AM)  
- **Upcoming Event:** *The Big Game* — Saturday, Sept 18  

### The Problem
- **Inventory:** Wings at **40%** (Low)  
- **Demand Prediction:** **280% spike** expected on Game Day  
- **Financial Crunch:**  
  - Bank balance: **$30k**  
  - Immediate obligations: **$33k** (Payroll + Supplier)  
- **Risk:**  
  - Potential revenue loss: **$12,000+**  
  - Previous season loss: **$8k**

### The Solution (The Offer)
- **Loan Amount:** $30,000  
- **Speed:** Instant approval, funds in **~4 hours**  
- **Repayment:** **8% of daily sales** (auto-collected for ~12 weeks)  
- **ROI:**  
  - $12k protected revenue vs ~$2.4k cost  
  - **400% ROI**

---

## 3. Application Specifications

### Architecture & Views
The application uses a **state toggle** to switch between two views.

---

### View A: **Lender Dashboard (Admin)**

**Feature 1: Context Modal (New)**  
- Shown on load  
- Explains:
  - *The Idea:* Turning transaction data into capital  
  - *Why Mastercard*

**Feature 2: Opportunity Radar**
- Merchant: **Taco Rico**
- **Risk Score:** 86  
- Triggers displayed:
  - Inventory at 40%  
  - Obligations at $33k  

**Feature 3: Gemini Risk Memo**
- **Input:** Risk Score (86), ROI (400%), contextual signals  
- **Output:**  
  - Gemini generates a concise, professional **credit underwriter memo** in real time

---

### View B: **Mobile App (Maria’s Experience)**

**Home Screen**
- Personalized header:
  - “Good Morning, Maria”
  - “Taco Rico • Austin, TX”

**Notification**
- *“Game Day Alert: Stockout Risk Detected”*

**Chat Interface – “Clara” (AI Agent)**
- **Scripted Flow:**  
  - Fixed **9-step narrative** (not a real chatbot)
- **User Interaction:**  
  - Demo advances via predefined **Reply buttons**
  - Example: *“Ask about repayment”*

**Feature 4: Gemini Explanation**
- **Trigger:** “Sparkles” button in chat input  
- **Function:**  
  - If Maria hesitates on the 8% term, Gemini generates an empathetic explanation
  - Explains why **dynamic repayment** is safer than a fixed monthly bill

---


