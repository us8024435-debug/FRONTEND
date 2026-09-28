"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  ArrowLeft,
  Play,
  RotateCcw,
  Maximize2,
  Lock,
  Layers,
  Sparkles,
  GitBranch,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { TriggerNode, ConditionNode, ActionNode, EndNode } from "@/components/automation";

// Register custom node types outside the component to prevent re-creation
const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  end: EndNode,
};

// 5 pre-loaded demo workflow nodes
const initialNodes: Node[] = [
  {
    id: "node-1",
    type: "trigger",
    position: { x: 380, y: 50 },
    data: {
      label: "New Message Received",
      description: "Triggers on any incoming customer WhatsApp message",
      triggerType: "message_received",
    },
  },
  {
    id: "node-2",
    type: "condition",
    position: { x: 360, y: 220 },
    data: {
      label: "Contains keyword 'pricing'",
      description: 'keywords: ["pricing", "cost", "plans", "rate"]',
    },
  },
  {
    id: "node-3",
    type: "action",
    position: { x: 160, y: 400 },
    data: {
      label: "Send Template: pricing_info",
      description: "Auto-replies with standard pricing catalog & tiered rates",
      actionType: "template",
    },
  },
  {
    id: "node-4",
    type: "action",
    position: { x: 560, y: 400 },
    data: {
      label: "Assign to Agent",
      description: "Routes unclassified inquiry to available Tier-1 agent queue",
      actionType: "agent",
    },
  },
  {
    id: "node-5",
    type: "end",
    position: { x: 410, y: 570 },
    data: {
      label: "End",
      description: "Workflow cycle completed",
    },
  },
];

// Edges connecting the nodes with stylized branches and markers
const initialEdges: Edge[] = [
  {
    id: "edge-1-2",
    source: "node-1",
    target: "node-2",
    animated: true,
    style: { stroke: "#10b981", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#10b981",
    },
  },
  {
    id: "edge-2-3",
    source: "node-2",
    sourceHandle: "yes",
    target: "node-3",
    animated: true,
    label: "Yes (keyword matches)",
    style: { stroke: "#10b981", strokeWidth: 2 },
    labelStyle: {
      fill: "#10b981",
      fontWeight: 600,
      fontSize: 11,
    },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 6,
    labelBgStyle: {
      fill: "var(--background)",
      stroke: "#10b981",
      strokeWidth: 1,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#10b981",
    },
  },
  {
    id: "edge-2-4",
    source: "node-2",
    sourceHandle: "no",
    target: "node-4",
    animated: true,
    label: "No (fallback)",
    style: { stroke: "#f43f5e", strokeWidth: 2 },
    labelStyle: {
      fill: "#f43f5e",
      fontWeight: 600,
      fontSize: 11,
    },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 6,
    labelBgStyle: {
      fill: "var(--background)",
      stroke: "#f43f5e",
      strokeWidth: 1,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#f43f5e",
    },
  },
  {
    id: "edge-3-5",
    source: "node-3",
    target: "node-5",
    animated: true,
    style: { stroke: "#3b82f6", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#3b82f6",
    },
  },
  {
    id: "edge-4-5",
    source: "node-4",
    target: "node-5",
    animated: true,
    style: { stroke: "#3b82f6", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#3b82f6",
    },
  },
];

interface WorkflowCanvasProps {
  workflowId: string;
  workflowName?: string;
  status?: string;
}

function WorkflowCanvasContent({
  workflowId,
  workflowName = "Welcome Message",
  status = "active",
}: WorkflowCanvasProps) {
  const { resolvedTheme } = useTheme();
  const { fitView } = useReactFlow();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [isSimulating, setIsSimulating] = React.useState(false);

  const handleTestFlow = () => {
    setIsSimulating(true);
    toast.info("Simulating workflow execution...", {
      description: "Evaluating trigger conditions and mock routing...",
    });

    setTimeout(() => {
      setIsSimulating(false);
      toast.success("Simulation Completed Successfully", {
        description:
          "Trigger fired → Condition evaluated (True) → pricing_info sent → Finished in 184ms",
      });
    }, 1200);
  };

  const handleResetView = () => {
    fitView({ padding: 0.2, duration: 400 });
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-56px)] w-full overflow-hidden bg-background">
      {/* Top Floating Control Bar */}
      <header className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Link href="/automation">
              <ArrowLeft className="size-3.5" />
              <span>All Automations</span>
            </Link>
          </Button>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <GitBranch className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-foreground">{workflowName}</h1>
                <StatusBadge status={status} variant="workflow" />
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Workflow Toolbar */}
        <div className="flex items-center gap-2">
          {/* Read Only Indicator */}
          <Badge
            variant="outline"
            className="hidden sm:inline-flex items-center gap-1.5 border-dashed py-1 text-xs text-muted-foreground"
          >
            <Lock className="size-3 text-muted-foreground/70" />
            <span>Read-Only Visual Demo</span>
          </Badge>

          {/* Node Count Pill */}
          <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            <Layers className="size-3" />
            <span>5 Nodes</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetView}
            className="h-8 gap-1.5 text-xs"
            title="Fit Canvas to Viewport"
          >
            <Maximize2 className="size-3.5" />
            <span className="hidden sm:inline">Fit View</span>
          </Button>

          <Button
            size="sm"
            onClick={handleTestFlow}
            disabled={isSimulating}
            className="h-8 gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700 shadow-sm"
          >
            {isSimulating ? (
              <Sparkles className="size-3.5 animate-spin" />
            ) : (
              <Play className="size-3.5 fill-white" />
            )}
            <span>{isSimulating ? "Simulating..." : "Test Flow"}</span>
          </Button>
        </div>
      </header>

      {/* Main Canvas Area */}
      <div className="relative flex-1 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.2}
          maxZoom={1.5}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          colorMode={resolvedTheme === "dark" ? "dark" : "light"}
          proOptions={{ hideAttribution: true }}
          className="bg-dot-grid"
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1.2} className="opacity-40" />

          <Controls
            showInteractive={false}
            position="bottom-left"
            className="!m-4 !border !border-border !bg-card !shadow-md !rounded-xl overflow-hidden [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground hover:[&>button]:!bg-accent"
          />

          <MiniMap
            position="bottom-right"
            zoomable
            pannable
            className="!m-4 !border !border-border !bg-card !rounded-xl !shadow-md overflow-hidden"
            nodeColor={(node) => {
              switch (node.type) {
                case "trigger":
                  return "#10b981";
                case "condition":
                  return "#f59e0b";
                case "action":
                  return "#3b82f6";
                default:
                  return "#94a3b8";
              }
            }}
            nodeStrokeWidth={2}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasContent {...props} />
    </ReactFlowProvider>
  );
}

export default WorkflowCanvas;
