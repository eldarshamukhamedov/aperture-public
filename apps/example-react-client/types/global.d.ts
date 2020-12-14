// Injected environment variables
declare const APP_HOST: string;
declare const APP_PORT: number;
declare const NODE_ENV: string;
declare const PACKAGE_VERSION: string;
declare const PUBLIC_PATH: string;

// Static imports
declare module '*.png';
declare module '*.svg';

// Window globals
declare interface Window {}

// Hot module reloading
declare interface NodeModule {
  hot: { accept(path: string, handler: Function): void };
}
