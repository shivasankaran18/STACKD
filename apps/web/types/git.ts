export interface GitNode {
  id: string;
  author: string;
  message: string;
  timestamp: number;
  branches: string[];
}

export interface GitLink {
  source: string;
  target: string;
  branches: string[];
}

export interface GitData {
  nodes: GitNode[];
  links: GitLink[];
}

export interface CommitNode {
  x: number;
  y: number;
  data: GitNode;
}

export interface BranchLine {
  source: CommitNode;
  target: CommitNode;
  branch: string;
  color: string;
}

export interface Branch {
  name: string;
  color: string;
}