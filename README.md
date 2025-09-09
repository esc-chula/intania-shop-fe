# Intania Shop Frontend

A modern Next.js application built with cutting-edge web technologies for optimal performance and developer experience.

## 🛠️ Tech Stack

- **Next.js 15** - Latest version with App Router and React Server Components
- **React 19** - Latest React with improved concurrent features
- **Tailwind CSS 4** - Modern utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **TypeScript** - Full type safety and enhanced developer experience
- **Turbopack** - Ultra-fast bundler for development
- **ESLint & Prettier** - Code linting and formatting

### Core Framework

- [Next.js 15](https://nextjs.org/) - React framework for production
- [React 19](https://react.dev/) - JavaScript library for user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript

### Styling & UI

- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI

### Developer Experience

- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [Turbopack](https://turbo.build/pack) - Fast development bundler

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd intania-shop-fe
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🗂️ Project Structure

```
intania-shop-fe/
├── public/                 # Static assets
├── src/
│   ├── app/               # App Router pages and layouts
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # React components
│   │   └── ui/           # shadcn/ui components
│   └── lib/              # Utility functions
├── components.json        # shadcn/ui configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🧩 Available Components

The project includes shadcn/ui components with the "New York" style:

- **Button** - Customizable button component with multiple variants
- Additional components can be added using the shadcn/ui CLI

### Adding New Components

```bash
# Add a new shadcn/ui component
npx shadcn@latest add <component-name>
```

## 📝 Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm format:check` - Check code formatting
- `pnpm format:write` - Format code with Prettier

## 🎨 Styling

This project uses Tailwind CSS 4 with CSS variables for theming. The design system includes:

- **Colors**: Neutral base color with CSS variables for easy theming
- **Typography**: Geist Sans and Geist Mono fonts
- **Dark Mode**: Built-in dark mode support
- **Components**: Consistent styling with shadcn/ui components

## 📋 Git Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for clear and consistent commit messages.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```bash
feat: add user authentication system
fix: resolve navigation menu mobile responsiveness
docs: update API documentation
style: format code with prettier
refactor: simplify user service logic
perf: optimize image loading performance
test: add unit tests for button component
build: update dependencies to latest versions
ci: add automated testing workflow
chore: update gitignore file
```

### Scope (Optional)

The scope provides additional contextual information:

```bash
feat(auth): add login functionality
fix(ui): resolve button hover state
docs(readme): update installation instructions
```

## 🔄 Pull Request Guidelines

### Before Creating a PR

1. **Sync with main branch**

   ```bash
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run quality checks**

   ```bash
   pnpm lint
   pnpm format:check
   pnpm build
   ```

3. **Test your changes**
   - Ensure the application builds successfully
   - Test functionality in both development and production builds
   - Verify responsive design on different screen sizes

### PR Title Format

Follow the same convention as commit messages:

```
feat: add dark mode toggle
fix: resolve mobile navigation issue
docs: update component documentation
```

### PR Description Template

```markdown
## Description

Brief description of the changes made.

## Screenshots (if applicable) - (optional)

Add screenshots to help explain your changes.
```

### Review Process

1. **Self-review** your changes before requesting review
2. **Address feedback** promptly and professionally
3. **Keep PRs focused** - one feature/fix per PR
4. **Update documentation** as needed
5. **Squash commits** if requested to maintain clean history

### Merging

- PRs require at least one approval
- All CI checks must pass
- Conflicts must be resolved before merging
- Use "Squash and merge" for feature branches
- Use "Rebase and merge" for hotfixes

## 🤝 Contributing

1. **Create your feature branch**

   ```bash
   git checkout -b feat/amazing-feature
   ```

2. **Make your changes**
   - Follow the coding standards
   - Write meaningful commit messages
   - Add tests if applicable

3. **Commit your changes**

   ```bash
   git commit -m 'feat: add some amazing feature'
   ```

4. **Push to the branch**

   ```bash
   git push origin feat/amazing-feature
   ```

5. **Open a Pull Request**
   - Use the PR template
   - Provide clear description
   - Link related issues

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn about Tailwind CSS
- [shadcn/ui Documentation](https://ui.shadcn.com) - Learn about the component library
- [React Documentation](https://react.dev) - Learn about React

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using Next.js and modern web technologies.
