# Admin Frontend for Mora Exams

This repository contains the source code for the admin dashboard of Mora Exams. Built with React and TypeScript.

## Development guide
### Prerequisites

- Bun (v1.1.21 or later)

After cloning the repository, create an `.env` file in the root directory. Use `.env.example` for reference. 

### Commands

| Command            | Action                                       |
| ------------------ | -------------------------------------------- |
| `bun install`      | Installs dependencies                        |
| `bun run dev`      | Starts local dev server at `localhost:5173`  |
| `bun run build`    | Build the site for production (to `./dist/`) |
| `bun run preview`  | Preview your build locally, before deploying |
| `bun run lint`     | Lints the code                               |
| `bun run lint-fix` | Fixes linting issues                         |

### Deployment

The admin dashboard is deployed with Netlify on https://manage.moraexams.org.

### Project structure

```text
.
├── public - static files
├── src
│   ├── App.tsx
│   ├── common
│   ├── components
│   ├── css - base or global styles
│   ├── fonts - custom fonts
│   ├── hooks - common react hooks
│   ├── images - static images
│   ├── layout - components for layout
│   ├── main.tsx
│   ├── pages
│   ├── services
│   └── types
```

Various configuration files are located in the root directory of the project.
