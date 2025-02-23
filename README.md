# STACKD: Full-Stack Web Scaffolding Tool

STACKD is a powerful CLI-based scaffolding tool designed to help developers rapidly set up full-stack applications with customizable configurations. It automates the setup process, integrating authentication, database configurations, and UI libraries, making development faster and more efficient.


## Table of Contents

- Working
  - CLI Tool/Web tool
  - Configuration-Based Setup
- Features
  - Customizable Project Setup
  - Live Terminal Logs in GUI
- Use Cases
- Technologies Used
- Architecture
  - CLI Tool Architecture
  - Backend Architecture
- Team
- Contribution

## Working

### CLI Tool

STACKD provides a command-line interface where users can quickly scaffold a full-stack project by answering a few prompts. It generates a structured codebase with backend, frontend, and database configurations pre-integrated.

### Configuration-Based Setup

STACKD offers a guided setup process where users can specify:\
✅ Project Name\
✅ Frontend & Backend Tech Stack (Next.js, React, Angular, Express, etc.)\
✅ Database & ORM (PostgreSQL, MySQL, Prisma, TypeORM, etc.)\
✅ Authentication Method (OAuth, JWT, etc.)\
✅ UI Library (Tailwind CSS, ShadCN)

## Features

### Customizable Project Setup

STACKD allows developers to select the tech stack and configurations best suited for their project, ensuring a tailored development experience.

### Live Terminal Logs in GUI

The GUI interface provides real-time logs from the CLI execution, helping users track progress in a visually appealing manner.


## STACKD is ideal for:

✅ Individual Developers – Quickly scaffold full-stack apps without worrying about setup.\
✅ Startup Teams – Standardize tech stack and reduce setup time for new projects.\
✅ Software Engineering Teams – Maintain a consistent structure across multiple projects.\
✅ Hackathon Participants – Set up a ready-to-use environment instantly.\
✅ Educators & Students – Learn best practices in full-stack development through auto-generated projects.


### Core Stack

- *Frontend:* React, Angular, Vue, Next.js, Tailwind CSS, ShadCN
- *Backend:* Node.js, Express.js, Django, NestJS
- *Database:* PostgreSQL, MySQL, MongoDB
- *Authentication:* OAuth, JWT
  
## Additional Stacks That Can Be Implemented

- *Java Spring Boot* 
- *Go*
- *Svelte*

## CLI & UI Components

- *Inquirer.js* – For interactive command-line prompts
- *Chalk* – Provides colorful logs in the CLI
- *React & TypeScript* – For the GUI component


## Installation & Setup  

### CLI Tool  

## To scaffold a new full-stack project, run:  
```sh
npm create @shivasankaran18/stackd new proj-name
```
This will prompt you with setup questions and generate the project with the selected configurations.

### Web Tool
## To launch the web-based setup tool locally, use:

``` sh
npx @shivasankaran18/create-stackd setup
```




## Architecture

### CLI Tool Architecture

STACKD follows a modular architecture where the CLI interacts with the backend services to fetch configurations and generate the project structure.

#### Data Flow:

1️⃣ User selects configurations in the CLI\
2️⃣ STACKD processes selections and generates the project\
3️⃣ Live logs are displayed in both CLI & GUI\
4️⃣ The generated project is ready for development

### Backend Architecture

STACKD has a lightweight backend that processes configuration requests and handles GUI interactions.

#### Data Flow:

1️⃣ The GUI sends configuration data to the backend\
2️⃣ The backend triggers the project generation script\
3️⃣ The generated project is pushed to the specified directory

## Team

🛠 *Team Name:* return 1\
🚀 *Team Members:*

- Shiva Shankaran ([GitHub Profile](https://github.com/shivasankaran18/))
- Yashwanth ([GitHub Profile](https://github.com/Yashwanth1906))
- Darshan ([GitHub Profile](https://github.com/DARSHANCSE))
- Shyam ([GitHub Profile](https://github.com/ShyamSunder06))

## Contribution

We welcome contributions and feedback from the community to enhance STACKD’s capabilities. Your insights help us refine the tool and add new features!

### Ways to Contribute:

✅ *Feature Suggestions* – Share ideas to improve the tool\
✅ *Issue Reporting* – Report bugs and help improve stability\
✅ *Code Contributions* – Submit pull requests for enhancements

💡 Let's build better development tools together! 🚀

### 📜 License
This project is licensed under the MIT License.
