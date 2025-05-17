# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.11.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Running with Docker

This project includes a Docker setup for building and serving the production build using Nginx.

- **Node.js version:** 22.13.1 (used for building the app)
- **Nginx version:** 1.27-alpine (serves the built app)

### Build and Run with Docker Compose

To build and run the frontend using Docker Compose:

```bash
docker compose up --build
```

This will:
- Build the Angular app in a Node.js 22.13.1 environment
- Serve the optimized production build with Nginx

The application will be available at [http://localhost:80](http://localhost:80).

### Ports

- **80:** Exposes the frontend via Nginx (mapped to your host's port 80)

### Environment Variables

- No environment variables are required by default. If you add a `.env` file, you can uncomment the `env_file` line in `docker-compose.yml` to include it.

### Special Configuration

- The container runs as a non-root user for improved security.
- A custom `nginx.conf` is used to serve the built Angular app.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
