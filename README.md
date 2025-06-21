


# PostMan Client

This project develops a robust REST client application, similar in functionality to Postman, allowing users to send various HTTP requests (GET, POST, PUT, DELETE) to any URL and view the responses in real-time without full page reloads. The application also features a historical request logging system, leveraging MikroORM for data persistence and demonstrating efficient handling of large datasets.

## Technical Stack

- <strong>Frontend</strong>:
	- <strong>React:</strong> For building the user interface.
	- <strong>Next.js:</strong> React framework for server-side rendering, routing, and API routes.
	- <strong>CSS Framework/Styling:</strong> Tailwind CSS
- <strong>Backend</strong>:
	- <strong>Next.js API Routes:</strong> For handling incoming HTTP requests from the frontend and acting as a proxy to external APIs.
- <strong>Database</strong>:
	- <strong>Postgres:</strong> Used as the primary relational database to store and manage historical HTTP request logs efficiently.
- <strong>ORM (Object-Relational Mapper)</strong>:
	- <strong>MikroORM:</strong> For interacting with the database and managing historical requests.
- <strong>HTTP Client (Node.js)</strong>:
	- <strong>fetch:</strong> For making requests from the Next.js API routes to external target URLs.



# Installation

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn
- A running instance of Postgres database.

### Clone the repository:


	git clone https://github.com/akashbhardwaj23/postman-client.git
	cd postman-client

### Install dependencies:
	npm install

### Configure Environment Variables:

Create a .env.local file in the root of the project:


	# Database Configuration (for MikroORM)
	# If using SQLite:
	DATABASE_URL="sqlite://./my-rest-client-history.sqlite"
	
	# If using PostgreSQL:
	# DATABASE_URL="postgresql://user:password@host:port/database_name"
	# Note: Ensure you have your database running and accessible.


### Run Database Migrations (for MikroORM):

This step sets up your database schema based on your MikroORM entities.

	npm run db:init
	npm run db:up

### Start the Next.js development server:

	npm run dev



## Connect

mail - [akashbhardwaj415@gmail.com](mailTo:akashbhardwaj415@gmail.com)