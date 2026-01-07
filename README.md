# UiPath Process Explorer

A professional enterprise dashboard for viewing, filtering, and executing UiPath Orchestrator processes with real-time status updates.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/swati354/uipath-oauth-5)

## Overview

UiPath Process Explorer is a comprehensive enterprise dashboard application designed to display and manage all automation processes from UiPath Orchestrator. The application provides a clean, corporate-appropriate interface optimized for business users managing automation workflows.

## Key Features

- **Process Management**: View all processes in a sortable, filterable table with status indicators
- **Real-time Monitoring**: Live status updates with automatic refreshing
- **Process Execution**: Start processes directly from the interface with confirmation dialogs
- **Advanced Filtering**: Search by name, filter by folder, and sort by various attributes
- **Professional UI**: Information-dense table with clean, enterprise-appropriate design
- **Responsive Design**: Optimized for desktop and mobile devices

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **UiPath Integration**: Official UiPath TypeScript SDK
- **State Management**: Zustand + React Query
- **Authentication**: OAuth 2.0 with UiPath Orchestrator
- **Deployment**: Cloudflare Pages
- **Package Manager**: Bun

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- UiPath Orchestrator instance with OAuth External App configured
- Modern web browser with JavaScript enabled

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uipath-process-explorer
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the project root with your UiPath Orchestrator configuration:
   
   ```env
   VITE_UIPATH_BASE_URL=https://your-orchestrator-url.com
   VITE_UIPATH_ORG_NAME=your-organization-name
   VITE_UIPATH_TENANT_NAME=your-tenant-name
   VITE_UIPATH_CLIENT_ID=your-oauth-client-id
   VITE_UIPATH_REDIRECT_URI=http://localhost:3000
   VITE_UIPATH_SCOPE=OR.Execution OR.Folders.Read
   ```

4. **Start the development server**
   ```bash
   bun run dev
   ```

   The application will be available at `http://localhost:3000`

## UiPath Orchestrator Setup

### OAuth External App Configuration

1. **Create External Application**
   - Navigate to Admin → External Applications in UiPath Orchestrator
   - Click "Add Application"
   - Set Application Type to "Confidential Application"
   - Configure redirect URI to match your application URL

2. **Required Scopes**
   - `OR.Execution` - Execute processes
   - `OR.Folders.Read` - Read folder information
   - `OR.Processes.Read` - Read process information

3. **Get Client Credentials**
   - Copy the Client ID from the created application
   - Use this Client ID in your `.env` file

## Usage

### Process Dashboard

The main dashboard displays all available processes in a comprehensive table format:

- **View Processes**: Browse all processes with details like name, description, version, and status
- **Search & Filter**: Use the search bar to find specific processes by name or description
- **Folder Selection**: Switch between different Orchestrator folders using the folder selector
- **Sort Columns**: Click column headers to sort by different attributes
- **Status Filtering**: Use status filter chips to show only processes with specific statuses

### Process Execution

- **Start Process**: Click the "Start" button on any process row
- **Confirmation**: Confirm process execution in the dialog that appears
- **Status Updates**: Monitor execution status with real-time updates
- **Notifications**: Receive toast notifications for successful starts and errors

### Real-time Monitoring

- **Auto-refresh**: Process data refreshes automatically every 30 seconds
- **Status Indicators**: Color-coded status badges (green for available, yellow for running, red for failed)
- **Live Updates**: Process status changes are reflected immediately in the interface

## Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── uipath/         # UiPath-specific components
│   └── layout/         # Layout components
├── hooks/              # React Query hooks for UiPath SDK
├── lib/                # Utility functions and SDK configuration
├── pages/              # Application pages
└── main.tsx           # Application entry point
```

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally
- `bun run lint` - Run ESLint

### Adding New Features

1. **UiPath Integration**: Use existing hooks in `src/hooks/` for UiPath SDK operations
2. **UI Components**: Leverage shadcn/ui components from `src/components/ui/`
3. **Styling**: Use Tailwind CSS classes following the established design system
4. **State Management**: Use React Query for server state and Zustand for client state

## Deployment

### Cloudflare Pages

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/swati354/uipath-oauth-5)

**Manual Deployment:**

1. **Build the application**
   ```bash
   bun run build
   ```

2. **Deploy to Cloudflare Pages**
   - Connect your repository to Cloudflare Pages
   - Set build command: `bun run build`
   - Set build output directory: `dist`
   - Configure environment variables in Cloudflare Pages dashboard

3. **Environment Variables**
   
   Add the following environment variables in your Cloudflare Pages project settings:
   
   ```
   VITE_UIPATH_BASE_URL=https://your-orchestrator-url.com
   VITE_UIPATH_ORG_NAME=your-organization-name
   VITE_UIPATH_TENANT_NAME=your-tenant-name
   VITE_UIPATH_CLIENT_ID=your-oauth-client-id
   VITE_UIPATH_REDIRECT_URI=https://your-app-domain.pages.dev
   VITE_UIPATH_SCOPE=OR.Execution OR.Folders.Read
   ```

### Other Platforms

The application can be deployed to any static hosting service:

- **Vercel**: Connect repository and deploy
- **Netlify**: Drag and drop `dist` folder or connect repository
- **AWS S3**: Upload `dist` folder contents to S3 bucket

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_UIPATH_BASE_URL` | UiPath Orchestrator base URL | Yes |
| `VITE_UIPATH_ORG_NAME` | Organization name | Yes |
| `VITE_UIPATH_TENANT_NAME` | Tenant name | Yes |
| `VITE_UIPATH_CLIENT_ID` | OAuth client ID | Yes |
| `VITE_UIPATH_REDIRECT_URI` | OAuth redirect URI | No (defaults to current origin) |
| `VITE_UIPATH_SCOPE` | OAuth scopes | No (defaults to OR.Execution) |

### Customization

- **Branding**: Update colors in `tailwind.config.js` and `src/index.css`
- **Polling Intervals**: Modify refresh rates in hook files
- **Table Columns**: Customize displayed columns in process table components
- **Filters**: Add additional filter options in the dashboard component

## Troubleshooting

### Common Issues

**Authentication Errors**
- Verify OAuth client ID and redirect URI configuration
- Ensure UiPath Orchestrator External App is properly configured
- Check that all required scopes are granted

**Process Loading Issues**
- Confirm user has access to the specified folders
- Verify network connectivity to UiPath Orchestrator
- Check browser console for detailed error messages

**Build Errors**
- Ensure all environment variables are properly set
- Verify Bun version compatibility
- Clear node_modules and reinstall dependencies

### Support

For issues related to:
- **UiPath SDK**: Refer to [UiPath SDK documentation](https://docs.uipath.com)
- **Application bugs**: Create an issue in this repository
- **Deployment**: Check Cloudflare Pages documentation

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request