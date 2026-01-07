# Usage

## ⚠️ CRITICAL: UiPath SDK Type Definitions
**ALWAYS refer to the official UiPath TypeScript SDK type definitions when working with any UiPath data.**

### Type Reference Rules
1. **NEVER guess property names** - Always check the SDK types
2. **Use exact property names** from the SDK type definitions
3. **Import types** from `uipath-sdk` for type safety

### SDK Type Reference
**📖 COMPLETE TYPE DEFINITIONS: See `UIPATH_SDK_TYPES.md` in the project root**

This file contains the OFFICIAL UiPath TypeScript SDK type definitions with:
- All interface and enum definitions
- Common property name mistakes and corrections
- Complete response type structures
- Usage examples

Key type categories:
- **Processes**: `ProcessGetResponse`, `ProcessStartRequest`, `ProcessStartResponse`
- **Tasks**: `RawTaskGetResponse`, `TaskCreateOptions`, `TaskStatus`, `TaskPriority`
- **Queues**: `QueueGetResponse`
- **Assets**: `AssetGetResponse`, `AssetValueType`
- **Maestro**: `RawMaestroProcessGetAllResponse`, `RawProcessInstanceGetResponse`, `RawCaseInstanceGetResponse`
- **Entities**: `RawEntityGetResponse`, `EntityRecord`, `FieldMetaData`
- **Buckets**: `BucketGetResponse`, `BucketGetFileMetaDataResponse`
- **Errors**: All error types extend `UiPathError`

### Always Import Types
```typescript
import type {
  ProcessGetResponse,
  RawTaskGetResponse,
  QueueGetResponse,
  AssetGetResponse
} from 'uipath-sdk';

// Then use them for type safety
const process: ProcessGetResponse = await uipath.processes.getById(123);
console.log(process.processVersion); // ✅ Correct
console.log(process.version); // ❌ TypeScript error - property doesn't exist
```

## ⚠️ CRITICAL: Using Pre-built Hooks - NEVER MOCK DATA
**This template provides React Query hooks that call the UiPath SDK directly. You MUST use these hooks and NEVER mock data.**

### Absolute Rules:
1. **NEVER create mock data** - All data MUST come from real UiPath SDK calls
2. **NEVER use placeholder/fake data** - Even during development, use real API calls
3. **NEVER create dummy/sample data objects** - Let the hooks fetch real data
4. **ALWAYS use the provided hooks** - They handle all UiPath API interactions

❌ **NEVER DO THIS:**
```typescript
// ❌ NO mock data
const mockProcesses = [
  { id: 1, name: 'Sample Process', status: 'Running' }
];

// ❌ NO fetch calls
const response = await fetch('/api/uipath/processes');

// ❌ NO hardcoded placeholder data
const [processes, setProcesses] = useState([
  { name: 'Demo Process', key: 'demo-key' }
]);
```

✅ **ALWAYS DO THIS:**
```typescript
// ✅ Use the provided hooks - they return REAL data from UiPath
// Make sure SDK is initialized before using hooks
import { useUiPathProcesses } from '@/hooks/useUiPathProcesses';

// ✅ Wait for SDK initialization before enabling queries
const [isSDKInitialized, setIsSDKInitialized] = useState(false);

// Initialize SDK first
useEffect(() => {
  const initSDK = async () => {
    try {
      await initializeUiPathSDK();
      setIsSDKInitialized(true);
    } catch (error) {
      console.error('SDK initialization failed:', error);
    }
  };
  initSDK();
}, []);

// ✅ Only enable hooks after SDK is ready
const { data: processes, isLoading, error } = useUiPathProcesses(undefined, isSDKInitialized);
// processes contains REAL data from your UiPath environment
```

### Why No Mock Data?
- The UiPath SDK is already configured and authenticated
- All hooks are ready to use immediately
- Real data provides accurate testing
- Mock data creates false expectations and bugs

All UiPath functionality is accessible through pre-built hooks. DO NOT create fetch() calls, mock data, or API endpoints.

## Overview
UiPath Dashboard Template - Frontend-only React application with pre-configured uipath-sdk SDK for building automation management interfaces.

- Frontend: React Router 6 + TypeScript + ShadCN UI + UiPath Components
- UiPath Integration: Pre-configured SDK client with React Query hooks
- Architecture: Pure frontend - UiPath SDK runs directly in the browser

## 🎯 UiPath SDK Integration

### OAuth Authentication
**⚠️ CRITICAL: The UiPath SDK uses OAuth authentication. You must initialize the SDK before using it.**

The SDK must be initialized with OAuth:
```typescript
import { initializeUiPathSDK, getUiPath } from '@/lib/uipath';

// ✅ Initialize SDK with OAuth on app load
await initializeUiPathSDK();

// ✅ Then use the SDK
const uipath = getUiPath();
const processes = await uipath.processes.getAll();
```


### ⛔ Authentication Rules:
1. **ALWAYS call `initializeUiPathSDK()`** - Required for OAuth flow
3. **Handle async initialization** - OAuth requires async setup
4. **Use `getUiPath()` after init** - Get the initialized instance

❌ **NEVER DO THIS:**
```typescript
// ❌ NO - Don't skip initialization
import { getUiPath } from '@/lib/uipath';
const uipath = getUiPath(); // Will throw error - not initialized

// ❌ NO - Don't create client without OAuth
import { UiPath } from 'uipath-sdk';
const client = new UiPath({
  baseUrl: process.env.UIPATH_URL
  // Missing OAuth configuration
});

// ❌ NO - Don't forget to await initialization
initializeUiPathSDK(); // Missing await
const uipath = getUiPath();
const processes = await uipath.processes.getAll();
```

✅ **ALWAYS DO THIS:**
```typescript
// ✅ Initialize with OAuth first
import { initializeUiPathSDK, getUiPath } from '@/lib/uipath';

// Initialize OAuth (usually in app entry point)
await initializeUiPathSDK();

// Then use the SDK
const uipath = getUiPath();
const processes = await uipath.processes.getAll();
```

### Available React Query Hooks
**⚠️ IMPORTANT: These hooks return REAL data from your UiPath environment. NEVER create mock data - use these hooks directly.**

Use these hooks in your components for automatic caching, refetching, and loading states:

**Processes:**
- `useUiPathProcesses(folderId?)` - Get all processes
- `useUiPathProcess(processId, folderId?)` - Get specific process
- `useStartProcess()` - Mutation to start a process

**Queues:**
- `useUiPathQueues(folderId?)` - Get all queues
- `useUiPathQueue(queueId, folderId?)` - Get specific queue

**Tasks:**
- `useUiPathTasks(folderId?)` - Get all tasks
- `useAssignTask()` - Mutation to assign task
- `useCompleteTask()` - Mutation to complete task

**Assets:**
- `useUiPathAssets(folderId?)` - Get all assets
- `useUiPathAsset(assetId, folderId?)` - Get specific asset

**Maestro:**
- `useUiPathMaestroProcesses()` - Get Maestro processes
- `useUiPathMaestroInstances()` - Get process instances
- `usePauseMaestroInstance()` - Pause instance
- `useResumeMaestroInstance()` - Resume instance
- `useCancelMaestroInstance()` - Cancel instance

### Pre-built UiPath Components
Located in `src/components/uipath/`:

1. **JobStatusBadge** - Color-coded status indicators
   ```typescript
   <JobStatusBadge status="Running" />
   ```

2. **ProcessCard** - Display and start processes
   ```typescript
   <ProcessCard
     process={process}
     onStart={handleStart}
   />
   ```

3. **QueueMonitor** - Show queue statistics
   ```typescript
   <QueueMonitor queue={queue} />
   ```

4. **TaskCard** - Manage Action Center tasks
   ```typescript
   <TaskCard
     task={task}
     onAssign={handleAssign}
     onComplete={handleComplete}
   />
   ```

## 📋 Example Usage Pattern

**This example shows REAL data usage - NO mock data is created:**

```typescript
import { useUiPathProcesses, useStartProcess } from '@/hooks/useUiPathProcesses';
import { ProcessCard } from '@/components/uipath/ProcessCard';

export function MyPage() {
  // ✅ Hook fetches REAL processes from UiPath - no mock data needed
  const { data: processes, isLoading } = useUiPathProcesses();
  const { mutate: startProcess } = useStartProcess();

  if (isLoading) return <div>Loading...</div>;

  // ✅ processes contains REAL data from your UiPath Orchestrator
  return (
    <div>
      {processes?.map(process => (
        <ProcessCard
          key={process.id}
          process={process}
          onStart={(key) => startProcess({ processKey: key })}
        />
      ))}
    </div>
  );
}
```

**❌ NEVER do this:**
```typescript
// ❌ NO - Don't create mock data
const mockProcesses = [{ id: 1, name: 'Fake Process' }];

// ❌ NO - Don't use placeholder data
const [processes, setProcesses] = useState([]);
```

## 🎨 UiPath Branding
The template uses UiPath's brand colors:
- Primary Orange: `#FA4616`
- Dark Blue: `#1A1E28`

These are set as CSS variables and used throughout the components.

## Tech Stack
- React Router 6, ShadCN UI, Tailwind, Lucide, TypeScript
- uipath-sdk SDK (runs in browser)
- @tanstack/react-query for data fetching
- date-fns for date formatting
- Vite for build tooling

## Development Restrictions

### ⛔ ABSOLUTE PROHIBITIONS:
1. **NO MOCK DATA EVER**
   - ❌ NO mock/dummy/sample/placeholder data
   - ❌ NO hardcoded data arrays or objects for UiPath entities
   - ❌ NO fake data during development or testing
   - ✅ ONLY use real data from UiPath SDK hooks

2. **NO CUSTOM API CALLS**
   - ❌ NO fetch() calls
   - ❌ NO axios calls
   - ❌ NO custom API endpoints
   - ✅ ONLY use provided React Query hooks

3. **OAUTH AUTHENTICATION REQUIRED**
   - ✅ ALWAYS initialize SDK with OAuth
   - ✅ USE CLIENT_ID from External App configuration
   - ✅ AWAIT SDK initialization before use
   - ❌ NO skipping SDK initialization
   - ❌ NO creating clients without OAuth config

4. **Other Restrictions**
   - **Components**: Use existing ShadCN components instead of writing custom ones
   - **Icons**: Import from `lucide-react` directly
   - **Frontend Only**: This is a pure frontend app - all UiPath API calls happen from the browser

## Code Organization

### Application Structure
- `src/lib/uipath.ts` - UiPath SDK client configuration
- `src/hooks/` - React Query hooks for UiPath services
- `src/components/uipath/` - UiPath-specific components
- `src/components/ui/` - ShadCN UI components (auto-generated)
- `src/pages/DashboardPage.tsx` - Main dashboard example

## Important Notes

### UiPath SDK Authentication
**⚠️ CRITICAL: You MUST create a `.env` file with OAuth configuration for authentication.**

**REQUIRED: Create `.env` file in project root with these variables:**
```env
VITE_UIPATH_BASE_URL=<user's UiPath instance URL>
VITE_UIPATH_ORG_NAME=<organization name>
VITE_UIPATH_TENANT_NAME=<tenant name>
VITE_UIPATH_CLIENT_ID=<OAuth client ID from External App>
VITE_UIPATH_REDIRECT_URI=<OAuth redirect URI (optional, defaults to app origin)>
VITE_UIPATH_SCOPE=<OAuth scopes (optional, defaults to common Orchestrator scopes)>
```

The SDK configuration in `src/lib/uipath.ts` uses OAuth:
```typescript
export async function initializeUiPathSDK() {
    const sdk = new UiPath({
        baseUrl: import.meta.env.VITE_UIPATH_BASE_URL,
        orgName: import.meta.env.VITE_UIPATH_ORG_NAME,
        tenantName: import.meta.env.VITE_UIPATH_TENANT_NAME,
        clientId: import.meta.env.VITE_UIPATH_CLIENT_ID,
        redirectUri: import.meta.env.VITE_UIPATH_REDIRECT_URI || window.location.origin,
        scope: import.meta.env.VITE_UIPATH_SCOPE || 'OR.Execution OR.Folders...'
    });
    await sdk.initialize();
    return sdk;
}
```

**ABSOLUTE RULES:**
- ✅ **ALWAYS create `.env` file** with OAuth configuration
- ✅ **Use OAuth Client ID** from External App configuration (required)
- ✅ **Initialize SDK with OAuth** before using any SDK methods
- ✅ **ALWAYS handle async initialization** properly
- ❌ **NEVER skip OAuth setup**
- ❌ **NEVER use placeholder/demo credentials**

### Error Handling
All React Query hooks include automatic error handling with toast notifications.
Errors are displayed to users automatically.

### Polling/Refetching
- Processes: Refetch every 30 seconds
- Queues: Refetch every 10 seconds (for real-time monitoring)
- Tasks: Refetch every 15 seconds
- Maestro: Instances every 10 seconds, processes every 30 seconds

### Folder Context
Most UiPath operations support an optional `folderId` parameter to filter by Orchestrator folder.
Pass it to hooks when needed:
```typescript
const { data } = useUiPathProcesses(folderId);
```

## Extending the Template

### Adding New UiPath Services
1. Create a new hook in `src/hooks/useUiPath[Service].ts`
2. Use React Query's `useQuery` or `useMutation`
3. Import and use the `uipath` client from `src/lib/uipath`

### Adding Custom Components
1. Create component in `src/components/uipath/`
2. Use existing shadcn/ui components as building blocks
3. Follow UiPath branding guidelines (colors, typography)

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in your router configuration
3. Import and use UiPath hooks as needed

## Deployment
```bash
npm run build
```

The build creates a static site in the `dist/` directory that can be deployed to any static hosting service (Cloudflare Pages, Vercel, Netlify, etc.).
