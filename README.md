# STUDY-AI

A modern web application built with Next.js and deployed on AWS using SST (Serverless Stack).

## Prerequisites

Before you begin, ensure you have the following installed:

- [mise](https://mise.jdx.dev/) - Development environment manager
- [AWS CLI](https://aws.amazon.com/cli/) - Configured with appropriate credentials
- Git

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd study-ai
   ```

2. **Install mise and setup environment**
   ```bash
   # Install mise if you haven't already
   curl https://mise.run | sh
   
   # Install project dependencies and tools
   mise install
   ```
   
   This will automatically:
   - Install project dependencies
   - Setup git pre-commit hooks

3. **Environment configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   ```

## Development

### Start development server
```bash
# Using mise task
mise run dev

# Or directly with pnpm
pnpm sst:dev
```

This starts the SST development environment with hot reloading.

### Code quality checks
```bash
# Run linting and formatting checks
mise run pre-commit

# Or directly
pnpm check
```

## Project Structure

```
study-ai/
├── packages/
│   ├── web/          # Next.js web application
│   ├── core/         # Core business logic and types
│   └── db/           # Database layer and repositories
├── sst.config.ts     # SST infrastructure configuration
└── mise.toml         # Development environment config
```

## Deployment

### Production deployment
```bash
# Using mise task
mise run deploy

# Or directly with pnpm
pnpm prod-deploy
```

### Development deployment
```bash
pnpm sst:dev
```

## Infrastructure

The application uses the following AWS services:
- **DynamoDB** - Content storage (ContentsTable)
- **CloudFront** - Content delivery network (via Next.js deployment)
- **Route 53** - DNS management (when domain is configured)
- **Certificate Manager** - SSL certificates (when domain is configured)
- **Lambda** - Serverless functions (Next.js API routes)

## Removal

### Remove production environment
```bash
# Using mise task
mise run remove

# Or directly with pnpm
pnpm prod-remove
```

### Remove development environment
```bash
pnpm dev-remove
```

## Available Scripts

- `mise run dev` - Start development server
- `mise run deploy` - Deploy to production
- `mise run remove` - Remove production deployment
- `mise run pre-commit` - Run code quality checks
- `pnpm check` - Run linting and formatting checks (using Biome)
- `pnpm check:fix` - Run linting and formatting with auto-fix
- `pnpm build` - Build the web application

## Contributing

1. Make your changes
2. Run `mise run pre-commit` to ensure code quality
3. Commit your changes (pre-commit hooks will run automatically)
4. Push to your branch and create a pull request

## License

Private project - All rights reserved.