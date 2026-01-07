/**
 * UiPath SDK Client Configuration with OAuth Authentication
 *
 * This file configures the UiPath TypeScript SDK client with OAuth authentication.
 * The SDK provides access to UiPath Orchestrator services including:
 * - Processes, Queues, Tasks, Robots, Assets, Entities, and Maestro
 *
 * OAuth configuration is loaded from environment variables set in .env file.
 */

import { UiPath } from 'uipath-sdk';

let uipath: UiPath | null = null;

/**
 * Initialize UiPath SDK client with OAuth authentication
 *
 * Required OAuth credentials from environment variables:
 * - VITE_UIPATH_BASE_URL: Your UiPath instance URL
 * - VITE_UIPATH_ORG_NAME: Organization name
 * - VITE_UIPATH_TENANT_NAME: Tenant name
 * - VITE_UIPATH_CLIENT_ID: Your OAuth client ID (required)
 * - VITE_UIPATH_REDIRECT_URI: OAuth redirect URI (defaults to current origin)
 * - VITE_UIPATH_SCOPE: OAuth scopes (defaults to common Orchestrator scopes)
 */
export async function initializeUiPathSDK(): Promise<UiPath> {
    console.log('🚀 UiPath SDK: Starting initialization...');
    
    if (!uipath) {
        console.log('🔧 UiPath SDK: Creating new instance...');
        
        // Log all environment variables for debugging
        console.log('🔍 UiPath SDK: Environment variables:', {
            VITE_UIPATH_BASE_URL: import.meta.env.VITE_UIPATH_BASE_URL,
            VITE_UIPATH_ORG_NAME: import.meta.env.VITE_UIPATH_ORG_NAME,
            VITE_UIPATH_TENANT_NAME: import.meta.env.VITE_UIPATH_TENANT_NAME,
            VITE_UIPATH_CLIENT_ID: import.meta.env.VITE_UIPATH_CLIENT_ID ? '[PRESENT]' : '[MISSING]',
            VITE_UIPATH_SCOPE: import.meta.env.VITE_UIPATH_SCOPE || 'OR.Execution (default)',
            redirectUri: window.location.origin
        });
        
        if (!import.meta.env.VITE_UIPATH_CLIENT_ID) {
            console.error('❌ UiPath SDK: VITE_UIPATH_CLIENT_ID is missing');
            throw new Error('VITE_UIPATH_CLIENT_ID is required for OAuth authentication');
        }
        
        const config = {
            baseUrl: import.meta.env.VITE_UIPATH_BASE_URL,
            orgName: import.meta.env.VITE_UIPATH_ORG_NAME,
            tenantName: import.meta.env.VITE_UIPATH_TENANT_NAME,
            clientId: import.meta.env.VITE_UIPATH_CLIENT_ID,
            redirectUri: window.location.origin,
            scope: import.meta.env.VITE_UIPATH_SCOPE || 'OR.Execution',
        };
        
        console.log('⚙️ UiPath SDK: Configuration object:', config);
        
        try {
            console.log('🏗️ UiPath SDK: Creating UiPath instance...');
            uipath = new UiPath(config);
            console.log('✅ UiPath SDK: Instance created successfully');
            
            console.log('🔄 UiPath SDK: Calling initialize()...');
            console.log('📍 Current URL:', window.location.href);
            console.log('🔍 URL Search Params:', window.location.search);
            console.log('🪟 Is in iframe:', window.self !== window.top);
            
            // Check if we're in an OAuth callback
            const urlParams = new URLSearchParams(window.location.search);
            const hasCode = urlParams.has('code');
            const hasError = urlParams.has('error');
            console.log('🔐 OAuth callback detection:', { hasCode, hasError });
            
            if (hasError) {
                const error = urlParams.get('error');
                const errorDescription = urlParams.get('error_description');
                console.error('❌ OAuth Error:', error, errorDescription);
            }
            
            await uipath.initialize();
            console.log('✅ UiPath SDK: Initialization completed successfully');
        } catch (error) {
            console.error('❌ UiPath SDK: Error during initialization:', error);
            console.error('❌ UiPath SDK: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            throw error;
        }
    } else {
        console.log('♻️ UiPath SDK: Using existing instance');
    }
    
    console.log('🎉 UiPath SDK: Returning initialized instance');
    return uipath;
}

/**
 * Get the initialized UiPath SDK instance
 * Throws error if SDK has not been initialized
 */
export function getUiPath(): UiPath {
    console.log('📋 UiPath SDK: getUiPath() called');
    if (!uipath) {
        console.error('❌ UiPath SDK: Instance not found - SDK not initialized');
        throw new Error('UiPath SDK not initialized. Call initializeUiPathSDK() first.');
    }
    console.log('✅ UiPath SDK: Returning existing instance');
    return uipath;
}

/**
 * Type exports for UiPath SDK types
 */
export type { UiPath } from 'uipath-sdk';
