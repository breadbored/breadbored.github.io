import React, { useState, useEffect, useRef } from 'react';
import { Save, Plus, Trash2, Edit, X, RefreshCw } from 'lucide-react';

// Type definitions
interface DialogOption {
    text: string;
    next: string;
}

interface DialogPage {
    id: string;
    text: string;
    next: string | null;
    options: DialogOption[] | null;
}

interface DialogData {
    dialog: {
        page: DialogPage[];
    };
}

interface Node {
    id: string;
    index: number;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Edge {
    from: string;
    to: string;
    text: string | null;
    start: Point;
    end: Point;
    controlPoint: Point;
}

interface Point {
    x: number;
    y: number;
}

interface FlowchartLayout {
    nodes: Node[];
    edges: Edge[];
}

interface DragState {
    type: 'pan' | 'node';
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    nodeId?: string;
}

interface Transform {
    x: number;
    y: number;
    scale: number;
}

interface TransformUtils {
    toString: () => string;
    applyToPoint: (point: Point) => Point;
    updatePan: (dx: number, dy: number) => void;
    updateZoom: (factor: number, center: Point) => void;
    reset: () => void;
    get: () => Transform;
}

// Initial empty dialog structure
const EMPTY_DIALOG: DialogData = {
    dialog: {
        page: []
    }
};

// Node dimensions and spacing
const NODE_WIDTH = 200;
const NODE_HEIGHT = 120;
const NODE_MARGIN_X = 60;
const NODE_MARGIN_Y = 100;

// Transform utility for SVG
const createTransform = (): TransformUtils => {
    const transform: Transform = {
        x: 0,
        y: 0,
        scale: 1
    };

    return {
        toString: () => `translate(${transform.x},${transform.y}) scale(${transform.scale})`,
        applyToPoint: (point: Point) => ({
            x: (point.x - transform.x) / transform.scale,
            y: (point.y - transform.y) / transform.scale
        }),
        updatePan: (dx: number, dy: number) => {
            transform.x += dx;
            transform.y += dy;
        },
        updateZoom: (factor: number, center: Point) => {
            const oldScale = transform.scale;
            transform.scale *= factor;
            transform.x = center.x - (center.x - transform.x) * (transform.scale / oldScale);
            transform.y = center.y - (center.y - transform.y) * (transform.scale / oldScale);
        },
        reset: () => {
            transform.x = 0;
            transform.y = 0;
            transform.scale = 1;
        },
        get: () => ({ ...transform })
    };
};

// Initial XML data from the document
const INITIAL_XML = `<dialog>
    <page id="start">
        <text>
            The quick brown fox
            jumps over the lazy dog!
            ... Or, does it?
        </text>
        <options>
            <option text="Yes" next="page_yes"/>
            <option text="No" next="page_no"/>
        </options>
    </page>

    <page id="page_yes">
        <text>
            THE QUICK BROWN FOX
            JUMPS OVER THE LAZY DOG!
            ... YES, IT DOES!
        </text>
        <next>alphabet_upper</next>
    </page>

    <page id="page_no">
        <text>
            THE QUICK BROWN FOX
            JUMPS OVER THE LAZY DOG!
            ... NOPE!
        </text>
        <next>alphabet_upper</next>
    </page>

    <page id="alphabet_upper">
        <text>
            ABCDEFGHIJKLM
            NOPQRSTUVWXYZ
        </text>
        <options>
            <option text="Lower" next="alphabet_lower"/>
            <option text="Mixed" next="alphabet_mixed"/>
        </options>
    </page>

    <page id="alphabet_lower">
        <text>
            abcdefghijklm
            nopqrstuvwxyz
        </text>
        <next>exit</next>
    </page>

    <page id="alphabet_mixed">
        <text>
            AbCdEfGhIjKlM
            nOpQrStUvWxYz
        </text>
        <options>
            <option text="More" next="alphabet_mixed_alt"/>
            <option text="Leave" next="exit"/>
        </options>
    </page>

    <page id="alphabet_mixed_alt">
        <text>
            aBcDeFgHiJkLm
            NoPqRsTuVwXyZ
        </text>
        <next>exit</next>
    </page>
</dialog>`;

export default function DialogEditor(): JSX.Element {
    const [dialog, setDialog] = useState<DialogData>(EMPTY_DIALOG);
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [xmlContent, setXmlContent] = useState<string>(INITIAL_XML);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [flowchartLayout, setFlowchartLayout] = useState<FlowchartLayout>({
        nodes: [],
        edges: []
    });
    const [dragState, setDragState] = useState<DragState | null>(null);

    const svgRef = useRef<SVGSVGElement | null>(null);
    const transformRef = useRef<TransformUtils>(createTransform());

    // Load initial XML on mount
    useEffect(() => {
        parseXml(INITIAL_XML);
    }, []);

    // Parse XML string to dialog object
    const parseXml = (xmlString: string): void => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

        // Handle parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            console.error('XML parsing error:', parserError);
            return;
        }

        const pages = Array.from(xmlDoc.querySelectorAll('page')).map(page => {
            const id = page.getAttribute('id') || '';
            const textElement = page.querySelector('text');
            const text = textElement ? textElement.textContent?.trim() || '' : '';

            const nextElement = page.querySelector('next');
            const next = nextElement ? nextElement.textContent?.trim() || null : null;

            const options = Array.from(page.querySelectorAll('option')).map(option => ({
                text: option.getAttribute('text') || '',
                next: option.getAttribute('next') || ''
            }));

            return {
                id,
                text,
                next,
                options: options.length > 0 ? options : null
            };
        });

        setDialog({ dialog: { page: pages } });

        // Select first page if available
        if (pages.length > 0 && !selectedPageId) {
            setSelectedPageId(pages[0].id);
        }
    };

    // Convert dialog object to XML string
    const generateXml = (): string => {
        let xml = '<dialog>\n';

        dialog.dialog.page.forEach(page => {
            xml += `    <page id="${page.id}">\n`;
            xml += `        <text>\n            ${page.text}\n        </text>\n`;

            if (page.options && page.options.length > 0) {
                xml += '        <options>\n';
                page.options.forEach(option => {
                    xml += `            <option text="${option.text}" next="${option.next}"/>\n`;
                });
                xml += '        </options>\n';
            } else if (page.next) {
                xml += `        <next>${page.next}</next>\n`;
            }

            xml += '    </page>\n\n';
        });

        xml += '</dialog>';
        return xml;
    };

    // Generate a layout for the flowchart
    const generateLayout = (): void => {
        if (!dialog.dialog.page || dialog.dialog.page.length === 0) return;

        // Create a map of page IDs to node indices for quick lookup
        const pageMap = new Map<string, number>();
        dialog.dialog.page.forEach((page, index) => {
            pageMap.set(page.id, index);
        });

        // Create a directed graph structure
        interface GraphNode {
            id: string;
            index: number;
            nextNodes: number[];
            level: number;
            position: Point;
        }

        interface GraphEdge {
            from: number;
            to: number;
            text: string | null;
        }

        interface Graph {
            nodes: GraphNode[];
            edges: GraphEdge[];
        }

        const graph: Graph = {
            nodes: dialog.dialog.page.map((page, index) => ({
                id: page.id,
                index,
                nextNodes: [],
                level: 0, // Will be calculated in topological sort
                position: { x: 0, y: 0 } // Will be calculated based on level
            })),
            edges: []
        };

        // Add connections between nodes
        dialog.dialog.page.forEach((page, fromIndex) => {
            if (page.next) {
                const toIndex = pageMap.get(page.next);
                if (toIndex !== undefined) {
                    graph.nodes[fromIndex].nextNodes.push(toIndex);
                    graph.edges.push({
                        from: fromIndex,
                        to: toIndex,
                        text: null
                    });
                }
            }

            if (page.options) {
                page.options.forEach(option => {
                    if (option.next) {
                        const toIndex = pageMap.get(option.next);
                        if (toIndex !== undefined) {
                            graph.nodes[fromIndex].nextNodes.push(toIndex);
                            graph.edges.push({
                                from: fromIndex,
                                to: toIndex,
                                text: option.text
                            });
                        }
                    }
                });
            }
        });

        // Perform a topological sort to assign levels
        const visited = new Set<number>();
        const visiting = new Set<number>();

        function dfs(nodeIndex: number, level: number): void {
            if (visited.has(nodeIndex)) return;
            if (visiting.has(nodeIndex)) return; // Handle cycles

            visiting.add(nodeIndex);

            const node = graph.nodes[nodeIndex];
            node.level = Math.max(node.level, level);

            node.nextNodes.forEach(nextIndex => {
                dfs(nextIndex, level + 1);
            });

            visiting.delete(nodeIndex);
            visited.add(nodeIndex);
        }

        // Find root nodes (nodes with no incoming edges)
        const hasIncomingEdges = new Set(graph.edges.map(e => e.to));
        const rootNodes = graph.nodes
            .map((node, index) => index)
            .filter(index => !hasIncomingEdges.has(index));

        // If no root nodes, start with node 0
        if (rootNodes.length === 0 && graph.nodes.length > 0) {
            dfs(0, 0);
        } else {
            rootNodes.forEach(index => dfs(index, 0));
        }

        // Count nodes at each level
        const levelCounts: Record<number, number> = {};
        const levelPositions: Record<number, number> = {};

        graph.nodes.forEach(node => {
            levelCounts[node.level] = (levelCounts[node.level] || 0) + 1;
            levelPositions[node.level] = levelPositions[node.level] || 0;
        });

        // Assign x, y positions based on level
        graph.nodes.sort((a, b) => {
            // Sort by level first
            if (a.level !== b.level) return a.level - b.level;
            // Then by index within the level
            return a.index - b.index;
        });

        // Assign positions
        graph.nodes.forEach(node => {
            const position = levelPositions[node.level] || 0;
            const totalNodesAtLevel = levelCounts[node.level] || 1;

            // Calculate x position to center nodes at each level
            const levelWidth = totalNodesAtLevel * NODE_WIDTH + (totalNodesAtLevel - 1) * NODE_MARGIN_X;
            const startX = -levelWidth / 2;

            node.position = {
                x: startX + position * (NODE_WIDTH + NODE_MARGIN_X),
                y: node.level * (NODE_HEIGHT + NODE_MARGIN_Y)
            };

            levelPositions[node.level] = position + 1;
        });

        // Create the final layout data
        const nodes = graph.nodes.map((node, index) => ({
            id: dialog.dialog.page[node.index].id,
            index: node.index,
            text: dialog.dialog.page[node.index].text,
            x: node.position.x,
            y: node.position.y,
            width: NODE_WIDTH,
            height: NODE_HEIGHT
        }));

        const edges = graph.edges.map(edge => {
            const fromNode = nodes.find(n => n.index === edge.from);
            const toNode = nodes.find(n => n.index === edge.to);

            if (!fromNode || !toNode) return null;

            // Start and end points
            const start = {
                x: fromNode.x + NODE_WIDTH / 2,
                y: fromNode.y + NODE_HEIGHT
            };

            const end = {
                x: toNode.x + NODE_WIDTH / 2,
                y: toNode.y
            };

            return {
                from: fromNode.id,
                to: toNode.id,
                text: edge.text,
                start,
                end,
                controlPoint: {
                    x: (start.x + end.x) / 2,
                    y: start.y + (end.y - start.y) / 2
                }
            };
        }).filter(Boolean) as Edge[];

        setFlowchartLayout({ nodes, edges });
    };

    // Update XML and layout when dialog changes
    useEffect(() => {
        if (Object.keys(dialog).length > 0) {
            const newXml = generateXml();
            setXmlContent(newXml);
            setIsDirty(true);
            generateLayout();
        }
    }, [dialog]);

    // Get the currently selected page
    const getSelectedPage = (): DialogPage | null => {
        return dialog.dialog.page.find(page => page.id === selectedPageId) || null;
    };

    // Event handlers
    const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>): void => {
        if (e.button !== 0) return; // Only handle left mouse button

        const svg = svgRef.current;
        if (!svg) return;

        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse() || new DOMMatrix());

        setDragState({
            type: 'pan',
            startX: svgPoint.x,
            startY: svgPoint.y,
            lastX: svgPoint.x,
            lastY: svgPoint.y
        });
    };

    const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>): void => {
        if (!dragState) return;

        const svg = svgRef.current;
        if (!svg) return;

        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse() || new DOMMatrix());

        if (dragState.type === 'pan') {
            const dx = svgPoint.x - dragState.lastX;
            const dy = svgPoint.y - dragState.lastY;

            transformRef.current.updatePan(dx, dy);

            setDragState({
                ...dragState,
                lastX: svgPoint.x,
                lastY: svgPoint.y
            });
        } else if (dragState.type === 'node') {
            // Node dragging logic if needed
        }
    };

    const handleSvgMouseUp = (): void => {
        setDragState(null);
    };

    const handleSvgWheel = (e: React.WheelEvent<SVGSVGElement>): void => {
        e.preventDefault();

        const svg = svgRef.current;
        if (!svg) return;

        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse() || new DOMMatrix());

        // Calculate zoom factor based on wheel delta
        const factor = e.deltaY < 0 ? 1.1 : 0.9;

        transformRef.current.updateZoom(factor, svgPoint);

        // Force re-render
        setFlowchartLayout(prev => ({ ...prev }));
    };

    const resetZoom = (): void => {
        transformRef.current.reset();
        // Force re-render
        setFlowchartLayout(prev => ({ ...prev }));
    };

    // Dialog manipulation functions
    const updatePageText = (text: string): void => {
        setDialog(prev => {
            const newPages = prev.dialog.page.map(page =>
                page.id === selectedPageId ? { ...page, text } : page
            );
            return { dialog: { page: newPages } };
        });
    };

    const updatePageNext = (next: string): void => {
        setDialog(prev => {
            const newPages = prev.dialog.page.map(page =>
                page.id === selectedPageId ? { ...page, next } : page
            );
            return { dialog: { page: newPages } };
        });
    };

    const addOption = (): void => {
        setDialog(prev => {
            const newPages = prev.dialog.page.map(page => {
                if (page.id === selectedPageId) {
                    const currentOptions = page.options || [];
                    return {
                        ...page,
                        options: [...currentOptions, { text: 'New Option', next: '' }],
                        next: null // Remove next when adding options
                    };
                }
                return page;
            });
            return { dialog: { page: newPages } };
        });
    };

    const updateOption = (index: number, field: keyof DialogOption, value: string): void => {
        setDialog(prev => {
            const newPages = prev.dialog.page.map(page => {
                if (page.id === selectedPageId && page.options) {
                    const newOptions = [...page.options];
                    newOptions[index] = {
                        ...newOptions[index],
                        [field]: value
                    };
                    return { ...page, options: newOptions };
                }
                return page;
            });
            return { dialog: { page: newPages } };
        });
    };

    const removeOption = (index: number): void => {
        setDialog(prev => {
            const newPages = prev.dialog.page.map(page => {
                if (page.id === selectedPageId && page.options) {
                    const newOptions = page.options.filter((_, i) => i !== index);
                    return {
                        ...page,
                        options: newOptions.length > 0 ? newOptions : null
                    };
                }
                return page;
            });
            return { dialog: { page: newPages } };
        });
    };

    const addNewPage = (): void => {
        // Generate unique ID
        const existingIds = dialog.dialog.page.map(p => p.id);
        let newId = 'new_page';
        let counter = 1;

        while (existingIds.includes(newId)) {
            newId = `new_page_${counter}`;
            counter++;
        }

        const newPage: DialogPage = {
            id: newId,
            text: 'New page text',
            next: null,
            options: null
        };

        setDialog(prev => ({
            dialog: {
                page: [...prev.dialog.page, newPage]
            }
        }));

        setSelectedPageId(newId);
        setIsEditing(true);
    };

    const deletePage = (id: string): void => {
        if (dialog.dialog.page.length <= 1) {
            alert('Cannot delete the last page');
            return;
        }

        setDialog(prev => {
            const newPages = prev.dialog.page.filter(page => page.id !== id);

            // Update any references to this page
            newPages.forEach(page => {
                if (page.next === id) {
                    page.next = '';
                }

                if (page.options) {
                    page.options.forEach(option => {
                        if (option.next === id) {
                            option.next = '';
                        }
                    });
                }
            });

            return { dialog: { page: newPages } };
        });

        // Select another page if the current one is deleted
        if (selectedPageId === id) {
            setSelectedPageId(dialog.dialog.page[0]?.id);
            setIsEditing(false);
        }
    };

    const updatePageId = (oldId: string, newId: string): void => {
        if (oldId === newId) return;

        // Check if ID already exists
        if (dialog.dialog.page.some(page => page.id === newId)) {
            alert(`Page ID "${newId}" already exists`);
            return;
        }

        setDialog(prev => {
            // Update the page ID
            const newPages = prev.dialog.page.map(page =>
                page.id === oldId ? { ...page, id: newId } : page
            );

            // Update any references to this page
            newPages.forEach(page => {
                if (page.next === oldId) {
                    page.next = newId;
                }

                if (page.options) {
                    page.options.forEach(option => {
                        if (option.next === oldId) {
                            option.next = newId;
                        }
                    });
                }
            });

            return { dialog: { page: newPages } };
        });

        setSelectedPageId(newId);
    };

    const downloadXml = (): void => {
        const xml = generateXml();
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dialog.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsDirty(false);
    };

    const selectedPage = getSelectedPage();

    return (
        <div className="flex flex-col h-screen">
            <header className="bg-gray-800 text-white p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Untitled Dialog Editor</h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={resetZoom}
                            className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded flex items-center"
                        >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Reset View
                        </button>
                        <button
                            onClick={addNewPage}
                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Page
                        </button>
                        <button
                            onClick={downloadXml}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center"
                        >
                            <Save className="w-4 h-4 mr-1" />
                            {isDirty ? 'Save*' : 'Save'}
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Flowchart View */}
                <div className="flex-1 bg-gray-100 overflow-hidden">
                    <svg
                        ref={svgRef}
                        className="w-full h-full"
                        onMouseDown={handleSvgMouseDown}
                        onMouseMove={handleSvgMouseMove}
                        onMouseUp={handleSvgMouseUp}
                        onMouseLeave={handleSvgMouseUp}
                        onWheel={handleSvgWheel}
                    >
                        <g transform={transformRef.current.toString()}>
                            {/* Edges */}
                            {flowchartLayout.edges.map((edge, index) => {
                                // Calculate path for curved edges
                                const path = `M ${edge.start.x},${edge.start.y} 
                            C ${edge.start.x},${edge.start.y + 40} 
                              ${edge.end.x},${edge.end.y - 40} 
                              ${edge.end.x},${edge.end.y}`;

                                return (
                                    <g key={`edge-${index}`}>
                                        <path
                                            d={path}
                                            stroke={edge.from === selectedPageId ? "#3b82f6" : "#888"}
                                            strokeWidth="2"
                                            fill="none"
                                            markerEnd="url(#arrowhead)"
                                        />
                                        {edge.text && (
                                            <text
                                                x={(edge.start.x + edge.end.x) / 2}
                                                y={(edge.start.y + edge.end.y) / 2 - 10}
                                                textAnchor="middle"
                                                fill="#555"
                                                fontSize="12"
                                                fontWeight="bold"
                                                dominantBaseline="middle"
                                            >
                                                {edge.text}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}

                            {/* Nodes */}
                            {flowchartLayout.nodes.map(node => (
                                <g
                                    key={`node-${node.id}`}
                                    transform={`translate(${node.x},${node.y})`}
                                    onClick={() => {
                                        setSelectedPageId(node.id);
                                        setIsEditing(true);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <rect
                                        width={node.width}
                                        height={node.height}
                                        rx="8"
                                        ry="8"
                                        fill={selectedPageId === node.id ? "#bfdbfe" : "white"}
                                        stroke={selectedPageId === node.id ? "#3b82f6" : "#ccc"}
                                        strokeWidth="2"
                                    />

                                    <foreignObject
                                        x="10"
                                        y="10"
                                        width={node.width - 20}
                                        height="20"
                                    >
                                        <div className="text-xs font-bold overflow-hidden text-ellipsis"
                                            style={{ fontFamily: 'sans-serif' }}>
                                            {node.id}
                                        </div>
                                    </foreignObject>

                                    <line
                                        x1="10"
                                        y1="30"
                                        x2={node.width - 10}
                                        y2="30"
                                        stroke="#eee"
                                        strokeWidth="1"
                                    />

                                    <foreignObject
                                        x="10"
                                        y="35"
                                        width={node.width - 20}
                                        height={node.height - 45}
                                    >
                                        <div className="text-xs overflow-hidden" style={{ fontFamily: 'sans-serif' }}>
                                            {node.text.length > 100 ? node.text.substring(0, 97) + '...' : node.text}
                                        </div>
                                    </foreignObject>
                                </g>
                            ))}

                            {/* Arrow marker definition */}
                            <defs>
                                <marker
                                    id="arrowhead"
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="9"
                                    refY="3.5"
                                    orient="auto"
                                >
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
                                </marker>
                            </defs>
                        </g>
                    </svg>
                </div>

                {/* Editor Panel - Only visible when editing */}
                {isEditing && selectedPage && (
                    <div className="w-96 bg-white overflow-y-auto p-4 border-l">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">Edit Page</h2>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Page ID
                                </label>
                                <input
                                    type="text"
                                    value={selectedPage.id}
                                    onChange={(e) => updatePageId(selectedPage.id, e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Text Content
                                </label>
                                <textarea
                                    value={selectedPage.text}
                                    onChange={(e) => updatePageText(e.target.value)}
                                    className="w-full p-2 border rounded min-h-32"
                                    rows={5}
                                />
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-medium">Navigation</h3>
                                    {!selectedPage.options && (
                                        <button
                                            onClick={addOption}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Options
                                        </button>
                                    )}
                                </div>

                                {!selectedPage.options ? (
                                    <div className="flex items-center space-x-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Next Page:
                                        </label>
                                        <select
                                            value={selectedPage.next || ''}
                                            onChange={(e) => updatePageNext(e.target.value)}
                                            className="p-2 border rounded flex-1"
                                        >
                                            <option value="">Select next page...</option>
                                            {dialog.dialog.page.map(page => (
                                                <option
                                                    key={page.id}
                                                    value={page.id}
                                                    disabled={page.id === selectedPage.id}
                                                >
                                                    {page.id}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedPage.options.map((option, index) => (
                                            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                                                <div className="flex-1">
                                                    <label className="block text-xs text-gray-500 mb-1">
                                                        Option Text
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={option.text}
                                                        onChange={(e) => updateOption(index, 'text', e.target.value)}
                                                        className="w-full p-2 border rounded"
                                                    />
                                                </div>

                                                <div className="flex-1">
                                                    <label className="block text-xs text-gray-500 mb-1">
                                                        Next Page
                                                    </label>
                                                    <select
                                                        value={option.next}
                                                        onChange={(e) => updateOption(index, 'next', e.target.value)}
                                                        className="w-full p-2 border rounded"
                                                    >
                                                        <option value="">Select next page...</option>
                                                        {dialog.dialog.page.map(page => (
                                                            <option
                                                                key={page.id}
                                                                value={page.id}
                                                            >
                                                                {page.id}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <button
                                                    onClick={() => removeOption(index)}
                                                    className="text-red-600 hover:text-red-800 p-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            onClick={addOption}
                                            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded flex items-center"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Option
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t flex justify-between">
                                <button
                                    onClick={() => deletePage(selectedPage.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Delete Page
                                </button>

                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}