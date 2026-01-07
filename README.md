# UiPath Dashboard Template

A comprehensive **frontend-only** React dashboard template pre-configured with the UiPath TypeScript SDK for building automation management applications.

## ⚠️ IMPORTANT: Real Data Only
**This template uses REAL data from your UiPath environment. NEVER create mock, dummy, or placeholder data. All React Query hooks fetch live data from the configured UiPath SDK.**

## ⚠️ IMPORTANT: Pre-configured Authentication
**UiPath SDK credentials are hardcoded in `src/lib/uipath.ts`. DO NOT modify authentication or use environment variables. Just use the existing `uipath` client directly.**

## Features

✅ **Pre-configured UiPath SDK** - Authentication and client setup ready to use
✅ **React Query Hooks** - Efficient data fetching for all UiPath services
✅ **UiPath-Branded Components** - Professional UI components for processes, queues, tasks
✅ **Real-time Updates** - Automatic polling and refetching
✅ **TypeScript** - Full type safety throughout
✅ **Responsive Design** - Beautiful UI that works on all devices
✅ **Pure Frontend** - No backend needed, SDK runs directly in browser

## Quick Start

```bash
npm install
npm run dev
```

## Available UiPath Services

- **Processes** - View and start automation processes
- **Queues** - Monitor queue items and status
- **Tasks** - Manage Action Center tasks
- **Assets** - Access orchestrator assets
- **Maestro** - Control agentic process instances

## Pre-built Components

- `ProcessCard` - Display and manage processes
- `QueueMonitor` - Real-time queue monitoring
- `TaskCard` - Action Center task management
- `JobStatusBadge` - Color-coded status indicators

## Project Structure

```
src/
├── lib/
│   └── uipath.ts              # UiPath SDK client
├── hooks/
│   ├── useUiPathProcesses.ts  # Process hooks
│   ├── useUiPathQueues.ts     # Queue hooks
│   ├── useUiPathTasks.ts      # Task hooks
│   ├── useUiPathAssets.ts     # Asset hooks
│   └── useUiPathMaestro.ts    # Maestro hooks
├── components/
│   └── uipath/                # UiPath components
│       ├── ProcessCard.tsx
│       ├── QueueMonitor.tsx
│       ├── TaskCard.tsx
│       └── JobStatusBadge.tsx
└── pages/
    └── DashboardPage.tsx      # Example dashboard
```

## Usage Example

```typescript
import { useUiPathProcesses, useStartProcess } from '@/hooks/useUiPathProcesses';
import { ProcessCard } from '@/components/uipath/ProcessCard';

export function MyPage() {
  // ✅ Hook returns REAL data from UiPath - no mock data needed
  const { data: processes, isLoading } = useUiPathProcesses();
  const { mutate: startProcess } = useStartProcess();

  return (
    <div className="grid gap-4">
      {/* ✅ processes contains REAL data from your UiPath Orchestrator */}
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

**❌ DO NOT create mock data:**
```typescript
// ❌ NO - Don't do this
const mockProcesses = [{ id: 1, name: 'Fake' }];
```

## Documentation

- See `prompts/usage.md` for detailed usage instructions
- UiPath SDK: https://github.com/UiPath/uipath-typescript
- React Query: https://tanstack.com/query

## License

MIT
