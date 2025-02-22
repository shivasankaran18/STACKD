'use client';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { GitNode, GitLink, GitData, CommitNode, BranchLine, Branch } from '../types/git';

interface GitGraphProps {
  data: GitData;
}

const BRANCH_COLORS: { [key: string]: string } = {
  main: '#8B5CF6',
  dev: '#10B981',
  'feature-xyz': '#EF4444',
};

export function GitGraph({ data }: GitGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedCommit, setSelectedCommit] = useState<GitNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const width = 1600;
    const height = data.nodes.length * 80;
    const margin = { top: 60, right: 20, bottom: 20, left: 80 };
    const columnWidth = 120;
    const graphWidth = 800;
    const messageOffset = graphWidth + 40;

  
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

   
    const defs = svg.append('defs');
    Object.entries(BRANCH_COLORS).forEach(([branch, color]) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `glow-${branch}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('style', `stop-color: ${color}; stop-opacity: 0.4`);

      gradient.append('stop')
        .attr('offset', '50%')
        .attr('style', `stop-color: ${color}; stop-opacity: 1`);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('style', `stop-color: ${color}; stop-opacity: 0.4`);
    });


    const branchInfo = new Map<string, {
      x: number;
      startNode?: GitNode;
      endNode?: GitNode;
      commits: GitNode[];
    }>();

   
    ['main', 'dev', 'feature-xyz'].forEach((branch, i) => {
      branchInfo.set(branch, {
        x: columnWidth * (i + 1),
        commits: []
      });
    });

   
    data.nodes.forEach(node => {
      node.branches.forEach(branch => {
        const info = branchInfo.get(branch);
        if (info) {
          info.commits.push(node);
          if (!info.startNode) info.startNode = node;
          info.endNode = node;
        }
      });
    });


    branchInfo.forEach((info, branch) => {
      const startY = info.startNode ? 
        data.nodes.findIndex(n => n.id === info.startNode!.id) * 80 : 0;
      const endY = info.endNode ? 
        data.nodes.findIndex(n => n.id === info.endNode!.id) * 80 : height;

      svg.append('path')
        .attr('d', `M ${info.x} ${startY} L ${info.x} ${endY}`)
        .attr('stroke', BRANCH_COLORS[branch])
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.3);
    });

   
    const nodes: CommitNode[] = data.nodes.map((node, i) => {
      let x = columnWidth;
      if (node.branches.length > 0) {
        const branchX = branchInfo.get(node.branches[0])?.x;
        if (branchX) x = branchX;
      } else {
        const link = data.links.find(l => l.source === node.id || l.target === node.id);
        if (link) {
          const branchX = branchInfo.get(link.branches[0])?.x;
          if (branchX) x = branchX;
        }
      }
      return { x, y: i * 80, data: node };
    });

   
    data.links.forEach(link => {
      const source = nodes.find(n => n.data.id === link.source)!;
      const target = nodes.find(n => n.data.id === link.target)!;
      const branch = link.branches[0];
      const color = BRANCH_COLORS[branch];

      const points = [];
      if (source.x === target.x) {

        points.push([source.x, source.y]);
        points.push([target.x, target.y]);
      } else {
       
        const midY = (source.y + target.y) / 2;
        points.push([source.x, source.y]);
        points.push([source.x, midY]);
        points.push([target.x, midY]);
        points.push([target.x, target.y]);
      }

     
      const path = d3.line()(points);
      
      svg.append('path')
        .attr('d', path)
        .attr('stroke', `url(#glow-${branch})`)
        .attr('stroke-width', 12)
        .attr('fill', 'none')
        .style('opacity', 0.5);

      svg.append('path')
        .attr('d', path)
        .attr('stroke', color)
        .attr('stroke-width', 4)
        .attr('fill', 'none');
    });

   
    branchInfo.forEach((info, branch) => {
      const color = BRANCH_COLORS[branch];
      
      if (info.startNode) {
        const startNode = nodes.find(n => n.data.id === info.startNode!.id)!;
        svg.append('circle')
          .attr('cx', info.x)
          .attr('cy', startNode.y)
          .attr('r', 8)
          .attr('fill', color)
          .attr('stroke', '#1e1e1e')
          .attr('stroke-width', 2);
      }

      if (info.endNode) {
        const endNode = nodes.find(n => n.data.id === info.endNode!.id)!;
        svg.append('circle')
          .attr('cx', info.x)
          .attr('cy', endNode.y)
          .attr('r', 8)
          .attr('fill', color)
          .attr('stroke', '#1e1e1e')
          .attr('stroke-width', 2);
      }
    });

   
    const commitGroups = svg.selectAll('.commit-group')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'commit-group cursor-pointer')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .on('click', (event, d) => setSelectedCommit(d.data));

   
    commitGroups.append('circle')
      .attr('r', 20)
      .attr('fill', d => d.data.id === selectedCommit?.id ? '#3b82f6' : 'transparent')
      .attr('opacity', 0.2);

   
    commitGroups.append('circle')
      .attr('r', 16)
      .attr('fill', '#1e1e1e')
      .attr('stroke', d => {
        const branch = d.data.branches[0] || 
          data.links.find(l => l.source === d.data.id || l.target === d.data.id)?.branches[0];
        return BRANCH_COLORS[branch] || '#6b7280';
      })
      .attr('stroke-width', 4);

   
    const messageGroups = svg.append('g')
      .attr('class', 'commit-messages')
      .selectAll('.message-group')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'message-group')
      .attr('transform', d => `translate(${messageOffset},${d.y - 16})`);

   
    messageGroups.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width - messageOffset - margin.right)
      .attr('height', 48)
      .attr('fill', d => d.data.id === selectedCommit?.id ? '#2d3748' : '#1a202c')
      .attr('opacity', d => d.data.id === selectedCommit?.id ? 0.5 : 0.3)
      .attr('rx', 6);

   
    messageGroups.append('text')
      .attr('x', 12)
      .attr('y', 20)
      .attr('fill', d => {
        const branch = d.data.branches[0] || 
          data.links.find(l => l.source === d.data.id || l.target === d.data.id)?.branches[0];
        return BRANCH_COLORS[branch] || '#6b7280';
      })
      .attr('class', 'text-sm font-mono')
      .text(d => d.data.id.slice(0, 7));

   
    messageGroups.append('text')
      .attr('x', 100)
      .attr('y', 20)
      .attr('fill', 'currentColor')
      .attr('class', 'text-base font-medium')
      .text(d => d.data.message);

   
    messageGroups.append('text')
      .attr('x', 12)
      .attr('y', 38)
      .attr('fill', '#718096')
      .attr('class', 'text-xs')
      .text(d => `${d.data.author} • ${new Date(d.data.timestamp).toLocaleString()}`);

   
    const branches = Array.from(branchInfo.entries()).map(([name, info]) => ({
      name,
      color: BRANCH_COLORS[name],
      x: info.x
    }));

    svg.selectAll('.branch-label')
      .data(branches)
      .enter()
      .append('g')
      .attr('class', 'branch-label')
      .attr('transform', d => `translate(${d.x}, -40)`)
      .each(function(d) {
        const group = d3.select(this);
        
        group.append('rect')
          .attr('x', -35)
          .attr('y', -14)
          .attr('width', 70)
          .attr('height', 28)
          .attr('rx', 14)
          .attr('fill', d.color)
          .attr('opacity', 0.15);

        group.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', d.color)
          .attr('class', 'text-sm font-semibold')
          .text(d.name);
      });

  }, [data, selectedCommit]);

  return (
    <div className="h-full bg-[#1e1e1e] overflow-auto">
      <div className="p-8">
        <svg ref={svgRef} className="w-full" />
      </div>
    </div>
  );
}