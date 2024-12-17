# Clinic Manager App

A modern and user-friendly clinic/hospital management system. A comprehensive web application built with React, Tailwind CSS, and Supabase.

## 🌟 Features

- 📊 Real-time dashboard and statistics
- 👥 Patient management (CRUD operations)
- 👨‍⚕️ Staff management
- 📅 Appointment system
- 🏥 Department management
- 📱 Responsive design
- 🔍 Advanced search and filtering
- 📈 Department-based statistics

## 🚀 Technologies

- **Frontend:**
  - React 18
  - Tailwind CSS
  - React Query
  - React Router
  - HeadlessUI
  - React Hot Toast
  - Date-fns

- **Backend:**
  - Supabase (PostgreSQL)
  - Node.js
  - Express

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/mustafakbaser/ClinicManager-App.git
cd ClinicManager-App
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and add your Supabase credentials:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
VITE_SUPABASE_PROJECT_URL=your_supabase_project_url
VITE_SUPABASE_API_KEY=your_supabase_api_key
```

5. Set up the database schema:
   - Log in to your Supabase project
   - Open the SQL editor
   - Execute the SQL commands from `database.sql`

6. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/         # UI components
│   ├── appointments/  # Appointment-related components
│   ├── dashboard/     # Dashboard components
│   ├── patients/      # Patient management components
│   ├── staff/         # Staff management components
│   ├── form/          # Form components
│   └── ui/            # General UI components
├── services/          # API services
├── models/            # Data models
├── utils/             # Utility functions
├── hooks/             # Custom React hooks
├── lib/              # Third-party library configurations
└── pages/            # Page components
```

## 🔑 Key Features

### Dashboard
- Total patient, doctor, and appointment counts
- Recent appointments list
- Department-based appointment statistics
- Daily appointment tracking

### Patient Management
- Create and edit patient records
- National ID validation
- View patient history
- Appointment history

### Appointment System
- Create new appointments
- Update appointment status
- Date and time selection
- Department and doctor selection

### Staff Management
- Create staff records
- Department assignment
- Contact information management

## 📝 Usage

1. **Dashboard:** View general statistics and recent appointments on the main page.

2. **Patient Operations:**
   - Create new patient records
   - Edit existing patients
   - View patient history

3. **Appointment Operations:**
   - Create new appointments
   - Filter and search appointments
   - Update appointment status

4. **Staff Operations:**
   - Add new staff members
   - Edit staff information
   - Assign departments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔧 Development

### Code Style
- Follow React best practices
- Use functional components and hooks
- Implement proper error handling
- Write clean and maintainable code
- Follow the established project structure

### Testing
- Write unit tests for utilities
- Test components using React Testing Library
- Ensure proper error handling
- Test edge cases and validation

### Performance
- Implement proper caching strategies
- Use React Query for data fetching
- Optimize component rendering
- Follow React performance best practices

## 🔒 Security

- Implement proper authentication
- Validate all user inputs
- Secure API endpoints
- Follow security best practices
- Regular security updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [React Query](https://react-query.tanstack.com/)