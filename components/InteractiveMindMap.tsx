
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import ReactFlow, {
    useNodesState,
    useEdgesState,
    Background,
    Controls,
    ReactFlowProvider,
    Panel,
    type Node,
    type Edge,
} from 'reactflow';
import NodeDetailPanel from './NodeDetailPanel';
import CustomNode from './CustomNode'; // New custom node
import { getLayoutedElements } from '../utils/get-node-layout'; // New layout helper
import { useTheme } from '../hooks/useTheme';

interface Section {
    title: string;
    content: string;
}

interface InteractiveMindMapProps {
    title: string;
    sections: Section[];
}

const nodeTypes = { custom: CustomNode };

// New vibrant and professional color palette
const colorPalette = [
    '#2563eb', // Blue-600
    '#16a34a', // Green-600
    '#ca8a04', // Amber-600
    '#c026d3', // Fuchsia-600
    '#db2777', // Pink-600
    '#6d28d9', // Violet-700
];


const MindMap: React.FC<InteractiveMindMapProps> = ({ title, sections }) => {
    const { effectiveTheme } = useTheme();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Section | null>(null);

    const edgeOptions = useMemo(() => ({
        type: 'smoothstep',
        animated: true,
        style: { stroke: effectiveTheme === 'dark' ? '#4B5563' : '#9CA3AF', strokeWidth: 2 },
    }), [effectiveTheme]);

    useEffect(() => {
        if (!sections || sections.length === 0) return;

        const rootNode: Node = {
            id: 'root',
            type: 'custom',
            data: { label: title, icon: 'root', color: '#0e7490' }, // Stronger Cyan for root
            position: { x: 0, y: 0 },
        };

        const sectionNodes: Node[] = sections.map((section, index) => ({
            id: `section-${index}`,
            type: 'custom',
            data: {
                label: section.title,
                icon: section.title,
                color: colorPalette[index % colorPalette.length],
            },
            position: { x: 0, y: 0 },
        }));
        
        const allNodes = [rootNode, ...sectionNodes];
        const allEdges: Edge[] = sections.map((_, index) => ({
            id: `edge-${index}`,
            source: 'root',
            target: `section-${index}`,
        }));
        
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(allNodes, allEdges);
        
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

    }, [title, sections, setNodes, setEdges]);
    

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        if (node.id === 'root') {
             setSelectedNode({ title, content: "This is the central topic of the business plan. Click on a branch to explore its details." });
        } else {
            const index = parseInt(node.id.split('-')[1]);
            setSelectedNode(sections[index]);
        }
    }, [sections, title]);

    const handleClosePanel = useCallback(() => {
        setSelectedNode(null);
        setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
    }, [setNodes]);

    return (
        <div className="w-full h-[600px] bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={edgeOptions}
                fitView
                proOptions={{ hideAttribution: true }}
                nodesDraggable={true}
            >
                <Background color={effectiveTheme === 'dark' ? "#4B5563" : "#E5E7EB"} gap={24} />
                <Controls showInteractive={false} position="bottom-right" />
                <Panel position="top-left" className="text-gray-500 dark:text-gray-400 text-sm p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                    Drag nodes to rearrange the layout.
                </Panel>
            </ReactFlow>
            <NodeDetailPanel
                node={selectedNode}
                onClose={handleClosePanel}
            />
        </div>
    );
};

// Wrap with ReactFlowProvider
const InteractiveMindMap: React.FC<InteractiveMindMapProps> = (props) => (
    <ReactFlowProvider>
        <MindMap {...props} />
    </ReactFlowProvider>
);

export default InteractiveMindMap;
