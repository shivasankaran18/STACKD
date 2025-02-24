export interface ProjectConfig {
  projectName: string;
  projectPath: string;
  frontendPort: number;
  backendPort: number;
  dbUrl: string;
}

export function createReactTS(
  config: ProjectConfig, 
  projectDir: string, 
  emitLog: (message: string) => void
): Promise<void>; 