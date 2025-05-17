# Natural Language Date Interpreter

A full-stack web application that interprets natural language date expressions and generates structured JSON responses using Google's Gemini API. The application is built with Angular (frontend), Express.js (backend), and MySQL (database), all containerized using Docker.

## Technology Stack

| Layer          | Technology             |
| :------------- | :--------------------- |
| Frontend       | Angular                |
| Backend        | Node.js + Express      |
| API            | Google Gemini API      |
| Database       | MySQL (via Docker)     |
| Orchestration  | Docker Compose       |

Setup Instructions

1\. Clone the Repository

bash

```
git clone https://github.com/gitPirate12/natural-language-date-interpreter.git
cd natural-language-date-interpreter
```

2\. Create .env File

In the root directory, create a .env file and add the following environment variables:

env

```
PORT=3000
DATABASE_URL=your_database_url
GEMINIAPIKEY=your_gemini_api_key
```

3\. Start the App with Docker

Run the following command to build and start the application:

bash

```
docker-compose up --build
```

This command will:

-   Install dependencies.

-   Start the Angular frontend, Express backend, and MySQL database.

-   Run all services within a connected Docker environment.

Example Usage

Input

```
Monday in two weeks
```

Response

json

```
{
  "date": "2025-03-25",
  "request": "Monday in two weeks"
}
```