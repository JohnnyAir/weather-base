## Installation

1. **Install dependencies**:

   ```bash
   yarn
   ```

## Usage

### Development Server

To start the development server and run the project locally:

```bash
yarn dev
```

### Building for Production

To build the project for production:

```bash
yarn build
```

The production-ready files will be generated in the `dist` directory.

### Serve Production Build

To serve the production build locally:

```bash
yarn preview
```

### Run Test

To serve the production build locally:

```bash
yarn test
```

This will start a local server to serve the production build, allowing you to preview the application as it will appear in a production environment.

## Project Structure

The project structure is designed to keep your code organized and maintainable. Here's a brief overview of the important directories and files:

- `src`: Contains the source code of the React application.
  - `main.tsx`: Entry point of the application.
  - `modules`: App logical modules.
  - `pages`: Directory for defining individual pages or views of your application.
- `public`: Contains static assets that will be directly copied to the build output directory.