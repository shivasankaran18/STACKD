# STACKD - Full-Stack Scaffolding Tool

STACKD (Abbreviation TBD) is an open-source scaffolding tool that simplifies the process of setting up a full-stack web application. It allows developers to generate a project with pre-configured frontend, backend, database, authentication, and other essential components in just a few clicks.

## 📖 Table of Contents

- [Motivation](#motivation)
- [Features](#features)
- [Tech Stack Options](#tech-stack-options)
- [Installation](#installation)
- [Usage](#usage)
- [Future Ideas](#future-ideas)
- [License](#license)

## 💡 Motivation

We got the motive to build this application because every time me and my team went for a hackathon, it used to take a lot of time to set up the project with basic things like frontend, UI setup, backend, ORM connection, authentication, and other configurations. People in the work environment also struggle with this, so we came up with this idea. STACKD allows programmers to jump directly into coding instead of spending time on tedious setup tasks.

## 🚀 Features

- **Flexible Project Setup**: Choose from multiple frontend, backend, database, and authentication options.
- **Automated Configuration**: Generates all necessary files, environment variables, and configurations.
- **Git Integration**: Initializes a Git repository and sets up the remote origin.
- **Pre-configured ORM & Database**: Automatically connects the chosen ORM with the selected database.
- **Instant Deployment Readiness**: Sets up authentication, UI frameworks, and other dependencies for a fully functional project.
- **Multiple Interfaces**: STACKD provides both a **CLI** and a **Graphical User Interface (GUI)** for easy project setup.

## 🎥 Demo

### CLI Demo
https://github.com/user-attachments/assets/debe9515-a38f-4ba2-9126-b9b6f95e3a87

### Web Tool Demo
https://github.com/user-attachments/assets/465451f2-1e1a-48b6-a99e-253ef4f28e2d


## 🛠️ Tech Stack Options

### **Frontend**

- React.js
- React TypeScript
- Next.js
- Vue.js
- Vue TypeScript
- Angular TypeScript
- Django (Frontend Templates)

### **Backend**

- Express.js
- Express TypeScript
- Django Rest Framework

### **Database**

- PostgreSQL
- MongoDB

### **ORM**

- Prisma
- Hazel
- Mongoose

### **UI Framework**

- ShadCN
- Tailwind CSS

### **Authentication**

- JWT
- NextAuth
- Passport

## 📦 Installation

### Prerequisites

Make sure you have the following installed on your system:

- Node.js
- Git

### CLI Tool

To scaffold a new full-stack project, run:

```sh
npm create @shivasankaran18/stackd new proj-name
```

This will prompt you with setup questions and generate the project with the selected configurations.

### Web Tool

To launch the web-based setup tool locally, use:

```sh
npx @shivasankaran18/create-stackd setup
```

## ⚡ Usage

Select the frontend, backend, UI, database, ORM, authentication method, database URL, and GitHub URL, and **BOOM!** Your project is ready to work.

## 🔮 Future Ideas

- Adding desktop tools like **Electron**.
- Expanding support for more development tools and frameworks.
- Adding mobile app development tools.
- Building a **robust and efficient** platform that works across **Windows, Linux, and macOS**.
- Integrating **automated deployment** features, allowing users to deploy their applications instantly.
- Enabling **Git commit automation and CI/CD integration**, so projects stay updated with minimal manual effort.

## 📜 License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software under the terms of the MIT LICENSE.

