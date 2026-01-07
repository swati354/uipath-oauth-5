# UiPath TypeScript SDK - Complete Type Definitions Reference

**⚠️ CRITICAL: This file contains the OFFICIAL type definitions from the UiPath TypeScript SDK.**
**ALWAYS consult this file when using ANY UiPath SDK types to ensure correct property names.**

---

## Table of Contents
1. [Core Configuration Types](#core-configuration-types)
2. [Authentication Types](#authentication-types)
3. [Error Types](#error-types)
4. [Common Types](#common-types)
5. [Pagination Types](#pagination-types)
6. [Action Center (Tasks) Types](#action-center-tasks-types)
7. [Data Fabric (Entities) Types](#data-fabric-entities-types)
8. [Maestro Types](#maestro-types)
9. [Orchestrator Types](#orchestrator-types)

---

## Core Configuration Types

### SDK Configuration

```typescript
// Base configuration with common required fields
export interface BaseConfig {
  baseUrl: string;
  orgName: string;
  tenantName: string;
}

// OAuth specific fields
export interface OAuthFields {
  clientId: string;
  redirectUri: string;
  scope: string;
}

// Configuration type that enforces either secret or complete OAuth fields
export type UiPathSDKConfig = BaseConfig & (
  | { secret: string; clientId?: never; redirectUri?: never; scope?: never }
  | ({ secret?: never } & OAuthFields)
);
```

---

## Common Types

```typescript
// Generic collection response wrapper
export interface CollectionResponse<T> {
  value: T[];
}

// Standardized result interface for all operation methods
export interface OperationResponse<TData> {
  success: boolean;
  data: TData;
}

// Common enum for job state used across services
export enum JobState {
  Pending = 'Pending',
  Running = 'Running',
  Stopping = 'Stopping',
  Terminating = 'Terminating',
  Faulted = 'Faulted',
  Successful = 'Successful',
  Stopped = 'Stopped',
  Suspended = 'Suspended',
  Resumed = 'Resumed'
}

// Base options for API requests
export interface BaseOptions {
  expand?: string;
  select?: string;
}

// Common request options interface used across services
export interface RequestOptions extends BaseOptions {
  filter?: string;
  orderby?: string;
}
```

---

## Pagination Types

```typescript
// Simplified universal pagination cursor
export interface PaginationCursor {
  value: string;
}

// Pagination options
export type PaginationOptions = {
  pageSize?: number;
  cursor?: PaginationCursor;
  jumpToPage?: number;
};

// Paginated response containing items and navigation information
export interface PaginatedResponse<T> {
  items: T[];
  totalCount?: number;
  hasNextPage: boolean;
  nextCursor?: PaginationCursor;
  previousCursor?: PaginationCursor;
  currentPage?: number;
  totalPages?: number;
  supportsPageJump: boolean;
}

// Response for non-paginated calls
export interface NonPaginatedResponse<T> {
  items: T[];
  totalCount?: number;
}

// Pagination constants
export const MAX_PAGE_SIZE = 1000;
export const DEFAULT_PAGE_SIZE = 50;
```

---

## Action Center (Tasks) Types

### Core Task Types

```typescript
export interface UserLoginInfo {
  name: string;
  surname: string;
  userName: string;
  emailAddress: string;
  displayName: string;
  id: number;
}

export enum TaskType {
  Form = 'FormTask',
  External = 'ExternalTask',
  App = 'AppTask'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum TaskStatus {
  Unassigned = 'Unassigned',
  Pending = 'Pending',
  Completed = 'Completed'
}

export enum TaskActivityType {
  Created = 'Created',
  Assigned = 'Assigned',
  Reassigned = 'Reassigned',
  Unassigned = 'Unassigned',
  Saved = 'Saved',
  Forwarded = 'Forwarded',
  Completed = 'Completed',
  Commented = 'Commented',
  Deleted = 'Deleted',
  BulkSaved = 'BulkSaved',
  BulkCompleted = 'BulkCompleted',
  FirstOpened = 'FirstOpened'
}
```

### Task Response Structure

```typescript
export interface TaskBaseResponse {
  status: TaskStatus;
  title: string;
  type: TaskType;
  priority: TaskPriority;
  folderId: number;
  key: string;
  isDeleted: boolean;
  creationTime: string;
  id: number;
  action: string | null;
  externalTag: string | null;
  lastAssignedTime: string | null;
  completionTime: string | null;
  parentOperationId: string | null;
  deleterUserId: number | null;
  deletionTime: string | null;
  lastModificationTime: string | null;
}

export interface RawTaskGetResponse extends TaskBaseResponse {
  isCompleted: boolean;
  encrypted: boolean;
  bulkFormLayoutId: number | null;
  formLayoutId: number | null;
  taskSlaDetail: TaskSlaDetail | null;
  taskAssigneeName: string | null;
  lastModifierUserId: number | null;
  assignedToUser: UserLoginInfo | null;
  creatorUser?: UserLoginInfo;
  lastModifierUser?: UserLoginInfo;
  taskAssignments?: TaskAssignment[];
  activities?: TaskActivity[];
  tags?: Tag[];
  formLayout?: Record<string, unknown>;
  actionLabel?: string | null;
  taskSlaDetails?: TaskSlaDetail[] | null;
  completedByUser?: UserLoginInfo | null;
  taskAssignmentCriteria?: string;
  taskAssignees?: UserLoginInfo[] | null;
  taskSource?: TaskSource | null;
  processingTime?: number | null;
  data?: Record<string, unknown> | null;
}
```

---

## Orchestrator Types

### Processes

```typescript
export enum PackageType {
  Undefined = 'Undefined',
  Process = 'Process',
  ProcessOrchestration = 'ProcessOrchestration',
  WebApp = 'WebApp',
  Agent = 'Agent',
  TestAutomationProcess = 'TestAutomationProcess',
  Api = 'Api',
  MCPServer = 'MCPServer',
  BusinessRules = 'BusinessRules'
}

export enum JobPriority {
  Low = 'Low',
  Normal = 'Normal',
  High = 'High'
}

export enum TargetFramework {
  Legacy = 'Legacy',
  Windows = 'Windows',
  Portable = 'Portable'
}

export interface ArgumentMetadata {
  input?: string;
  output?: string;
}

export interface ProcessGetResponse {
  key: string;
  packageKey: string;
  packageVersion: string;  // ⚠️ NOT "version"
  isLatestVersion: boolean;
  isPackageDeleted: boolean;
  description: string;
  name: string;
  entryPointId: number;
  packageType: PackageType;
  supportsMultipleEntryPoints: boolean;
  isConversational: boolean | null;
  minRequiredRobotVersion: string | null;
  isCompiled: boolean;
  arguments: ArgumentMetadata;
  autoUpdate: boolean;
  hiddenForAttendedUser: boolean;
  feedId: string;
  folderKey: string;
  targetFramework: TargetFramework;
  robotSize: RobotSize | null;
  lastModifiedTime: string | null;
  lastModifierUserId: number | null;
  createdTime: string;
  creatorUserId: number;
  id: number;
  folderId?: number;
  folderName?: string;
  jobPriority?: JobPriority;
  specificPriorityValue?: number;
  inputArguments?: string;
  environmentVariables?: string;
  entryPointPath?: string;
  remoteControlAccess?: RemoteControlAccess;
  requiresUserInteraction?: boolean;
}

export interface ProcessStartResponse {
  key: string;
  startTime: string | null;
  endTime: string | null;
  state: JobState;
  source: string;
  sourceType: string;
  batchExecutionKey: string;
  info: string | null;
  createdTime: string;
  startingScheduleId: number | null;
  processName: string;
  type: JobType;
  inputFile: string | null;
  outputArguments: string | null;
  outputFile: string | null;
  hostMachineName: string | null;
  persistenceId: string | null;
  resumeVersion: number | null;
  stopStrategy: StopStrategy | null;
  runtimeType: string;
  processVersionId: number | null;
  reference: string;
  packageType: PackageType;
  machine?: Machine;
  resumeOnSameContext: boolean;
  localSystemAccount: string;
  orchestratorUserIdentity: string | null;
  startingTriggerId: string | null;
  maxExpectedRunningTimeSeconds: number | null;
  parentJobKey: string | null;
  resumeTime: string | null;
  lastModifiedTime: string | null;
  jobError: JobError | null;
  errorCode: string | null;
  robot?: RobotMetadata;
  id: number;
  folderId?: number;
  folderName?: string;
  jobPriority?: JobPriority;
  specificPriorityValue?: number;
  inputArguments?: string;
  environmentVariables?: string;
  entryPointPath?: string;
  remoteControlAccess?: RemoteControlAccess;
  requiresUserInteraction?: boolean;
}
```

### Queues

```typescript
export interface QueueGetResponse {
  key: string;
  name: string;
  id: number;
  description: string;
  maxNumberOfRetries: number;
  acceptAutomaticallyRetry: boolean;
  retryAbandonedItems: boolean;
  enforceUniqueReference: boolean;
  encrypted: boolean;
  specificDataJsonSchema: string | null;
  outputDataJsonSchema: string | null;
  analyticsDataJsonSchema: string | null;
  createdTime: string;
  processScheduleId: number | null;
  slaInMinutes: number;
  riskSlaInMinutes: number;
  releaseId: number | null;
  isProcessInCurrentFolder: boolean | null;
  foldersCount: number;
  folderId: number;
  folderName: string;
}
```

### Assets

```typescript
export enum AssetValueScope {
  Global = 'Global',
  PerRobot = 'PerRobot'
}

export enum AssetValueType {
  DBConnectionString = 'DBConnectionString',
  HttpConnectionString = 'HttpConnectionString',
  Text = 'Text',
  Bool = 'Bool',
  Integer = 'Integer',
  Credential = 'Credential',
  WindowsCredential = 'WindowsCredential',
  KeyValueList = 'KeyValueList',
  Secret = 'Secret'
}

export interface CustomKeyValuePair {
  key?: string;
  value?: string;
}

export interface AssetGetResponse {
  key: string;
  name: string;
  id: number;
  canBeDeleted: boolean;
  valueScope: AssetValueScope;
  valueType: AssetValueType;
  value: string | null;
  credentialStoreId: number | null;
  keyValueList: CustomKeyValuePair[];
  hasDefaultValue: boolean;
  description: string | null;
  foldersCount: number;
  lastModifiedTime: string | null;
  lastModifierUserId: number | null;
  createdTime: string;
  creatorUserId: number;
}
```

---

## Data Fabric (Entities) Types

### Entity Field Types

```typescript
export enum EntityFieldDataType {
  UUID = 'UUID',
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  DATETIME = 'DATETIME',
  DATETIME_WITH_TZ = 'DATETIME_WITH_TZ',
  DECIMAL = 'DECIMAL',
  FLOAT = 'FLOAT',
  DOUBLE = 'DOUBLE',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  BIG_INTEGER = 'BIG_INTEGER',
  MULTILINE_TEXT = 'MULTILINE_TEXT'
}

export enum EntityType {
  Entity = 'Entity',
  ChoiceSet = 'ChoiceSet',
  InternalEntity = 'InternalEntity',
  SystemEntity = 'SystemEntity'
}

export enum ReferenceType {
  ManyToOne = 'ManyToOne'
}

export enum FieldDisplayType {
  Basic = 'Basic',
  Relationship = 'Relationship',
  File = 'File',
  ChoiceSetSingle = 'ChoiceSetSingle',
  ChoiceSetMultiple = 'ChoiceSetMultiple',
  AutoNumber = 'AutoNumber'
}

export enum DataDirectionType {
  ReadOnly = 'ReadOnly',
  ReadAndWrite = 'ReadAndWrite'
}

export enum JoinType {
  LeftJoin = 'LeftJoin'
}
```

### Entity Field Metadata

```typescript
export interface FieldDataType {
  name: EntityFieldDataType;
  lengthLimit?: number;
  maxValue?: number;
  minValue?: number;
  decimalPrecision?: number;
}

export interface Field {
  id: string;
  definition?: FieldMetaData;
}

export interface FieldMetaData {
  id: string;
  name: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isExternalField: boolean;
  isHiddenField: boolean;
  isUnique: boolean;
  referenceName?: string;
  referenceEntity?: RawEntityGetResponse;
  referenceChoiceSet?: RawEntityGetResponse;
  referenceField?: Field;
  referenceType: ReferenceType;
  fieldDataType: FieldDataType;
  isRequired: boolean;
  displayName: string;
  description: string;
  createdTime: string;
  createdBy: string;
  updatedTime: string;
  updatedBy?: string;
  isSystemField: boolean;
  fieldDisplayType?: FieldDisplayType;
  choiceSetId?: string;
  defaultValue?: string;
  isAttachment: boolean;
  isRbacEnabled: boolean;
}
```

### External Field Types

```typescript
export interface ExternalObject {
  id: string;
  externalObjectName?: string;
  externalObjectDisplayName?: string;
  primaryKey?: string;
  externalConnectionId: string;
  entityId?: string;
  isPrimarySource: boolean;
}

export interface ExternalConnection {
  id: string;
  connectionId: string;
  elementInstanceId: number;
  folderKey: string;
  connectorKey?: string;
  connectorName?: string;
  connectionName?: string;
}

export interface ExternalFieldMapping {
  id: string;
  externalFieldName?: string;
  externalFieldDisplayName?: string;
  externalObjectId: string;
  externalFieldType?: string;
  internalFieldId: string;
  directionType: DataDirectionType;
}

export interface ExternalField {
  fieldMetaData: FieldMetaData;
  externalFieldMappingDetail: ExternalFieldMapping;
}

export interface ExternalSourceFields {
  fields?: ExternalField[];
  externalObjectDetail?: ExternalObject;
  externalConnectionDetail?: ExternalConnection;
}

export interface SourceJoinCriteria {
  id: string;
  entityId: string;
  joinFieldName?: string;
  joinType: JoinType;
  relatedSourceObjectId?: string;
  relatedSourceFieldName?: string;
}
```

### Entity Records

```typescript
export interface EntityRecord {
  /**
   * Unique identifier for the record
   */
  id: string;

  /**
   * Additional dynamic fields for the entity
   */
  [key: string]: any;
}

export interface RawEntityGetResponse {
  name: string;
  displayName: string;
  entityType: EntityType;
  description: string;
  fields: FieldMetaData[];
  externalFields?: ExternalSourceFields[];
  sourceJoinCriterias?: SourceJoinCriteria[];
  recordCount?: number;
  storageSizeInMB?: number;
  usedStorageSizeInMB?: number;
  attachmentSizeInByte?: number;
  isRbacEnabled: boolean;
  id: string;
  createdBy: string;
  createdTime: string;
  updatedTime?: string;
  updatedBy?: string;
}
```

### Entity Operation Types

```typescript
export interface EntityGetRecordsByIdOptions {
  /** Level of entity expansion (default: 0) */
  expansionLevel?: number;
  /** Pagination options */
  pageSize?: number;
  cursor?: PaginationCursor;
  jumpToPage?: number;
}

export interface EntityOperationOptions {
  /** Level of entity expansion (default: 0) */
  expansionLevel?: number;
  /** Whether to fail on first error (default: false) */
  failOnFirst?: boolean;
}

export type EntityInsertOptions = EntityOperationOptions;
export type EntityUpdateOptions = EntityOperationOptions;

export interface EntityDeleteOptions {
  /** Whether to fail on first error (default: false) */
  failOnFirst?: boolean;
}

export interface FailureRecord {
  /** Error message */
  error?: string;
  /** Original record that failed */
  record?: Record<string, any>;
}

export interface EntityOperationResponse {
  /** Records that were successfully processed */
  successRecords: Record<string, any>[];
  /** Records that failed processing */
  failureRecords: FailureRecord[];
}

export type EntityInsertResponse = EntityOperationResponse;
export type EntityUpdateResponse = EntityOperationResponse;
export type EntityDeleteResponse = EntityOperationResponse;
```

---

## Maestro Types

### Maestro Processes

```typescript
export interface RawMaestroProcessGetAllResponse {
  processKey: string;
  packageId: string;
  name: string;
  folderKey: string;
  folderName: string;
  packageVersions: string[];
  versionCount: number;
  pendingCount: number;
  runningCount: number;
  completedCount: number;
  pausedCount: number;
  cancelledCount: number;
  faultedCount: number;
  retryingCount: number;
  resumingCount: number;
  pausingCount: number;
  cancelingCount: number;
}
```

### Process Instances

```typescript
export interface ProcessInstanceRun {
  runId: string;
  status: string;
  startedTime: string;
  completedTime: string;
}

export interface RawProcessInstanceGetResponse {
  instanceId: string;
  packageKey: string;
  packageId: string;
  packageVersion: string;  // ⚠️ NOT "version"
  latestRunId: string;
  latestRunStatus: string;  // ⚠️ NOT "status"
  processKey: string;
  folderKey: string;
  userId: number;
  instanceDisplayName: string;
  startedByUser: string;
  source: string;
  creatorUserKey: string;
  startedTime: string;
  completedTime: string | null;
  instanceRuns: ProcessInstanceRun[];
}
```

### Case Instances

```typescript
export interface CaseInstanceRun {
  runId: string;
  status: string;
  startedTime: string;
  completedTime: string;
}

export interface RawCaseInstanceGetResponse {
  instanceId: string;
  packageKey: string;
  packageId: string;
  packageVersion: string;  // ⚠️ NOT "version"
  latestRunId: string;
  latestRunStatus: string;  // ⚠️ NOT "status"
  processKey: string;
  folderKey: string;
  userId: number;
  instanceDisplayName: string;
  startedByUser: string;
  source: string;
  creatorUserKey: string;
  startedTime: string;
  completedTime: string;
  instanceRuns: CaseInstanceRun[];
  caseAppConfig?: CaseAppConfig;
  caseType?: string;
  caseTitle?: string;
}
```

---

## Error Types

### Error Classes

```typescript
// Base error class for all UiPath SDK errors
export abstract class UiPathError {
  public readonly type: string;
  public readonly message: string;
  public readonly statusCode?: number;
  public readonly requestId?: string;
  public readonly timestamp: Date;
  public readonly stack?: string;

  getDebugInfo(): Record<string, unknown>;
}

// Error thrown when authentication fails (401)
export class AuthenticationError extends UiPathError

// Error thrown when authorization fails (403)
export class AuthorizationError extends UiPathError

// Error thrown when validation fails (400)
export class ValidationError extends UiPathError

// Error thrown when a resource is not found (404)
export class NotFoundError extends UiPathError

// Error thrown when rate limit is exceeded (429)
export class RateLimitError extends UiPathError

// Error thrown when server encounters an error (5xx)
export class ServerError extends UiPathError {
  get isRetryable(): boolean;
}

// Error thrown when network/connection issues occur
export class NetworkError extends UiPathError
```

---

## Main SDK Class

```typescript
// Factory function for creating UiPath instance
export default function uipath(config: UiPathSDKConfig): UiPath

// Main SDK class
export class UiPath {
  constructor(config: UiPathSDKConfig);

  // Initialize the SDK (handles OAuth flow)
  public async initialize(): Promise<void>;

  // Check if the SDK has been initialized
  public isInitialized(): boolean;

  // Check if we're in an OAuth callback state
  public isInOAuthCallback(): boolean;

  // Complete OAuth authentication flow
  public async completeOAuth(): Promise<boolean>;

  // Check if the user is authenticated
  public isAuthenticated(): boolean;

  // Get the current authentication token
  public getToken(): string | undefined;

  // Access to Maestro services
  get maestro(): {
    processes: MaestroProcessesService & {
      instances: ProcessInstancesService;
      incidents: ProcessIncidentsService;
    };
    cases: CasesService & {
      instances: CaseInstancesService;
    };
  };

  // Access to Entity service
  get entities(): EntityService;

  // Access to Tasks service
  get tasks(): TaskService;

  // Access to Orchestrator Processes service
  get processes(): ProcessService;

  // Access to Orchestrator Buckets service
  get buckets(): BucketService;

  // Access to Orchestrator Queues service
  get queues(): QueueService;

  // Access to Orchestrator Assets service
  get assets(): AssetService;
}
```

---

## Usage Example

```typescript
import uipath, {
  UiPathSDKConfig,
  TaskStatus,
  TaskPriority,
  ProcessGetResponse,
  RawTaskGetResponse
} from 'uipath-sdk';

// Initialize with secret-based auth
const config: UiPathSDKConfig = {
  baseUrl: 'https://cloud.uipath.com',
  orgName: 'myorg',
  tenantName: 'mytenant',
  secret: 'my-secret-key'
};

const client = uipath(config);
await client.initialize();

// Use the SDK with proper types
const processes: ProcessGetResponse[] = await client.processes.getAll({ pageSize: 10 });

// Access properties correctly
processes.forEach(process => {
  console.log(process.packageVersion);  // ✅ Correct
  console.log(process.version);  // ❌ Error - property doesn't exist
});

const tasks: RawTaskGetResponse[] = await client.tasks.getAll({ pageSize: 10 });

// Access task properties correctly
tasks.forEach(task => {
  console.log(task.assignedToUser);  // ✅ Correct
  console.log(task.user);  // ❌ Error - property doesn't exist
});
```

---

**⚠️ REMEMBER: Always import and use the exact type definitions from `uipath-sdk` to avoid property name errors.**
