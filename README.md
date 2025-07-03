
# FriendlyMart Supermarket Management System

A comprehensive web-based supermarket management system built with React, TypeScript, and modern web technologies.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔑 Default Login Credentials
- **Username**: `admin`
- **Password**: `admin`

## ✨ Features

- 🔐 **Authentication** - Secure login with password reset
- 📊 **Dashboard** - Real-time analytics and KPIs
- 📦 **Inventory Management** - Product tracking with low stock alerts
- 👥 **Supplier Management** - Supplier database and relationships
- 👤 **Customer Management** - Customer tracking and analytics
- 💰 **Sales Management** - Point of sale and transaction recording
- 📈 **Reports** - Date-filtered reports with KSH currency
- 📱 **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI**: Shadcn/ui components
- **State**: React Context API, TanStack React Query
- **Routing**: React Router DOM
- **Storage**: localStorage (expandable to Supabase)
- **Charts**: Recharts
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth)
├── pages/          # Main application pages
├── utils/          # Database and utility functions
├── hooks/          # Custom React hooks
└── lib/            # Library configurations
```

## 🗄️ Data Management

The system uses localStorage for data persistence with the following collections:
- Users
- Products
- Suppliers
- Customers
- Sales

## 📖 Documentation

For detailed documentation, see [SYSTEM_DOCUMENTATION.md](SYSTEM_DOCUMENTATION.md)

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality
- Component-based architecture

## 🚢 Deployment

The application can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Lovable (native deployment)

## 🔮 Future Enhancements

- Supabase backend integration
- Real email service
- Barcode scanning
- Multi-location support
- Advanced analytics
- Mobile app

## 📄 License

This project is for educational and commercial use.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ using React and TypeScript
