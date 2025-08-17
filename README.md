# AI Business Consultant - Full Stack Application

A comprehensive full-stack AI business consultant application with Supabase database integration and Google authentication.

## Features

- 🤖 **AI-Powered Business Planning**: Generate comprehensive business plans using Google's Gemini AI
- 🔐 **Google Authentication**: Secure login with Google OAuth
- 💾 **Persistent Storage**: Save and manage multiple business plans with Supabase
- 📊 **Financial Analysis**: Interactive financial dashboards and projections
- 🎯 **SWOT Analysis**: Strategic planning with strengths, weaknesses, opportunities, and threats
- 💬 **Conversation Management**: Organize business planning sessions in separate conversations
- 🌙 **Dark Mode**: Full dark/light theme support
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Authentication, Row Level Security)
- **AI**: Google Gemini API
- **Charts**: Recharts for financial visualizations
- **Flow Diagrams**: ReactFlow for interactive mind maps

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- A Supabase account
- A Google Cloud Platform account (for Gemini API)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ai-business-consultant
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to Authentication > Providers and enable Google OAuth:
   - Add your Google OAuth client ID and secret
   - Set the redirect URL to: `http://localhost:5173/auth/callback`
4. Run the database migration:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase/migrations/create_initial_schema.sql`
   - Run the query to create all tables and security policies

### 3. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Gemini API
4. Create an API key for the Gemini API
5. For Google OAuth (if not already set up):
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Add `http://localhost:5173` to authorized origins
   - Add your Supabase auth callback URL to authorized redirect URIs

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key
```

### 5. Run the Application

1. Install dependencies:
   `npm install`
2. Start the development server:
   `npm run dev`
3. Open your browser and navigate to `http://localhost:5173`

## Database Schema

The application uses the following main tables:

- **profiles**: User profile information
- **conversations**: Chat conversations/sessions
- **messages**: Individual messages within conversations
- **business_plans**: Generated business plans with financial and SWOT data

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## Usage

1. **Sign In**: Use Google OAuth to authenticate
2. **Start Planning**: Click "New Conversation" or use example prompts
3. **Answer Questions**: The AI will ask clarifying questions about your business
4. **Review Plan**: Get a comprehensive business plan with multiple views:
   - Interactive flowchart/mind map
   - Detailed text plan
   - Financial dashboard with charts
   - SWOT analysis
   - Financial projections with scenario modeling
5. **Save & Manage**: All conversations and plans are automatically saved
6. **Iterate**: Refine your plan by chatting with the AI or editing business details

## Key Features Explained

### AI Business Planning
- Uses Google's Gemini AI for intelligent business plan generation
- Asks contextual clarifying questions based on business type and location
- Provides data-driven insights with local market considerations
- Supports plan amendments and iterations

### Financial Analysis
- Automatic parsing of financial data from AI responses
- Interactive charts for capital requirements and expenses
- Break-even analysis with customizable scenarios
- Staff and marketing cost breakdowns

### Conversation Management
- Multiple conversation threads for different business ideas
- Persistent chat history with full context
- Automatic conversation summarization for long discussions

### Security & Privacy
- Row Level Security ensures data isolation between users
- Google OAuth for secure authentication
- All sensitive data encrypted at rest in Supabase

## Development

### Project Structure
```
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Supabase client and utilities
├── services/           # AI service integration
├── supabase/           # Database migrations
├── types.ts            # TypeScript type definitions
├── utils/              # Utility functions
└── ...
```

### Key Components
- `App.tsx`: Main application with routing and authentication
- `ConversationSidebar.tsx`: Conversation management
- `PlanWorkspace.tsx`: Business plan display and interaction
- `FinancialProjections.tsx`: Interactive financial modeling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.