# Shypram Catalogue

A modern e-commerce catalogue application built with Next.js, React, and Supabase.

## Features

- 🛍️ Product catalogue with categories
- 🛒 Shopping cart functionality
- 👤 User authentication
- 📱 Responsive design
- 🌙 Dark/Light theme support
- 🔍 Product search
- 📊 Admin dashboard
- 💳 Order management

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Supabase
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd shypram-catalogue
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up the database:
   - Run the SQL scripts in `database/scripts/` in your Supabase SQL editor

### Development

Run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and stores
├── database/             # Database scripts
├── public/               # Static assets
└── styles/               # Global styles
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary.