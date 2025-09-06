# Quiz App

A modern, interactive quiz application built with a frontend interface and WordPress backend integration.

## 🚀 Live Demo

**[View Live Application](https://quiz-app-delta-pearl-16.vercel.app)**

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 📖 Overview

This quiz application provides an engaging platform for users to take interactive quizzes. Built with a modern frontend framework and powered by WordPress as a headless CMS, it offers a seamless user experience with dynamic content management capabilities.

## ✨ Features

- **Interactive Quiz Interface** - Clean, user-friendly design for taking quizzes
- **Dynamic Question Loading** - Questions fetched from WordPress backend
- **Real-time Score Calculation** - Instant feedback on quiz performance
- **Responsive Design** - Optimized for desktop and mobile devices
- **Multiple Question Types** - Support for various quiz formats
- **Progress Tracking** - Visual progress indicators during quiz
- **Results Summary** - Detailed results page with performance analytics
- **WordPress Integration** - Easy content management through WordPress admin
- **Fast Loading** - Optimized performance and quick response times

## 🛠️ Technologies Used

### Frontend
- **Framework**: [React/Next.js/Vue.js] *(specify your framework)*
- **Styling**: [CSS3/Tailwind CSS/Styled Components] *(specify your styling solution)*
- **State Management**: [Context API/Redux/Zustand] *(if applicable)*
- **HTTP Client**: [Axios/Fetch API] *(for API calls)*

### Backend
- **CMS**: WordPress (Headless)
- **API**: WordPress REST API
- **Hosting**: [WordPress.com/Self-hosted] *(specify your setup)*

### Deployment
- **Frontend**: Vercel
- **Domain**: Custom domain integration

## 🚦 Getting Started

### Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- WordPress installation with REST API enabled
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quiz-app.git
   cd quiz-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
   NEXT_PUBLIC_APP_URL=https://quiz-app-delta-pearl-16.vercel.app
   ```
