import {
  useEffect,
  useMemo,
  useRef,
  startTransition,
  useState,
  type PointerEvent,
  type WheelEvent,
} from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { DepartmentMember } from "@/features/department/data";
import { cn } from "@/lib/utils";

type DepartmentTreeNode = DepartmentMember & {
  children: DepartmentTreeNode[];
};

type PositionedNode = DepartmentTreeNode & {
  x: number;
  y: number;
  depth: number;
  branchIndex: number;
};

type Edge = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
};

const NODE_WIDTH = 142;
const NODE_HEIGHT = 100;
const HORIZONTAL_GAP = 18;
const VERTICAL_GAP = 62;
const STAGE_PADDING = 40;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.8;
const ZOOM_STEP = 0.1;

const palette = [
  {
    card: "border-sky-200 bg-sky-50/90",
    accent: "bg-sky-500",
    avatarBorder: "border-sky-200",
    text: "text-sky-700",
    line: "#bfdbfe",
  },
  {
    card: "border-rose-200 bg-rose-50/90",
    accent: "bg-rose-500",
    avatarBorder: "border-rose-200",
    text: "text-rose-700",
    line: "#fecdd3",
  },
  {
    card: "border-amber-200 bg-amber-50/90",
    accent: "bg-amber-500",
    avatarBorder: "border-amber-200",
    text: "text-amber-700",
    line: "#fde68a",
  },
  {
    card: "border-emerald-200 bg-emerald-50/90",
    accent: "bg-emerald-500",
    avatarBorder: "border-emerald-200",
    text: "text-emerald-700",
    line: "#a7f3d0",
  },
  {
    card: "border-indigo-200 bg-indigo-50/90",
    accent: "bg-indigo-500",
    avatarBorder: "border-indigo-200",
    text: "text-indigo-700",
    line: "#c7d2fe",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getTheme(depth: number, branchIndex: number) {
  return palette[Math.min(depth === 0 ? 0 : branchIndex + 1, palette.length - 1)];
}

function buildTree(members: DepartmentMember[]) {
  const nodes = new Map<number, DepartmentTreeNode>(
    members.map((member) => [member.id, { ...member, children: [] }]),
  );

  let root: DepartmentTreeNode | null = null;

  members.forEach((member) => {
    const node = nodes.get(member.id);
    if (!node) return;

    if (member.managerId === null) {
      root = node;
      return;
    }

    const parent = nodes.get(member.managerId);
    parent?.children.push(node);
  });

  return root;
}

function buildLayout(root: DepartmentTreeNode) {
  const positionedNodes: PositionedNode[] = [];
  const edges: Edge[] = [];
  let leafIndex = 0;

  const visit = (
    node: DepartmentTreeNode,
    depth: number,
    branchIndex: number,
  ): { centerX: number; maxDepth: number } => {
    const topY = depth * (NODE_HEIGHT + VERTICAL_GAP);
    const theme = getTheme(depth, branchIndex);

    if (node.children.length === 0) {
      const x = leafIndex * (NODE_WIDTH + HORIZONTAL_GAP);
      leafIndex += 1;
      positionedNodes.push({ ...node, x, y: topY, depth, branchIndex });
      return { centerX: x + NODE_WIDTH / 2, maxDepth: depth };
    }

    const childLayouts = node.children.map((child, index) =>
      visit(child, depth + 1, index),
    );

    const firstX = childLayouts[0]?.centerX ?? 0;
    const lastX = childLayouts.at(-1)?.centerX ?? firstX;
    const centerX = (firstX + lastX) / 2;
    const x = centerX - NODE_WIDTH / 2;

    positionedNodes.push({ ...node, x, y: topY, depth, branchIndex });

    childLayouts.forEach((childLayout) => {
      edges.push({
        fromX: centerX,
        fromY: topY + NODE_HEIGHT,
        toX: childLayout.centerX,
        toY: (depth + 1) * (NODE_HEIGHT + VERTICAL_GAP),
        color: theme.line,
      });
    });

    return {
      centerX,
      maxDepth: Math.max(...childLayouts.map((item) => item.maxDepth)),
    };
  };

  const rootLayout = visit(root, 0, 0);
  const stageWidth =
    Math.max(...positionedNodes.map((node) => node.x + NODE_WIDTH)) + STAGE_PADDING * 2;
  const stageHeight =
    rootLayout.maxDepth * (NODE_HEIGHT + VERTICAL_GAP) + NODE_HEIGHT + STAGE_PADDING * 2;

  return {
    nodes: positionedNodes.map((node) => ({
      ...node,
      x: node.x + STAGE_PADDING,
      y: node.y + STAGE_PADDING,
    })),
    edges: edges.map((edge) => ({
      ...edge,
      fromX: edge.fromX + STAGE_PADDING,
      fromY: edge.fromY + STAGE_PADDING,
      toX: edge.toX + STAGE_PADDING,
      toY: edge.toY + STAGE_PADDING,
    })),
    width: stageWidth,
    height: stageHeight,
  };
}

function OrgCard({
  node,
}: {
  node: PositionedNode;
}) {
  const theme = getTheme(node.depth, node.branchIndex);

  return (
    <div
      className={cn(
        "absolute select-none rounded-2xl border bg-white px-3 pb-3 pt-7 text-center shadow-[0_8px_24px_rgba(15,23,42,0.08)]",
        theme.card,
      )}
      style={{
        left: node.x,
        top: node.y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      }}
    >
      <div className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 justify-center">
        <Avatar
          size="lg"
          className={cn(
            "size-14 border-4 bg-white shadow-sm",
            theme.avatarBorder,
          )}
        >
          {node.avatarUrl ? (
            <AvatarImage src={node.avatarUrl} alt={node.name} />
          ) : null}
          <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700">
            {getInitials(node.name)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="space-y-0.5">
        <p className="truncate text-[13px] font-semibold text-slate-900">
          {node.name}
        </p>
        <p className="truncate text-[10px] text-slate-500">{node.role}</p>
        <p className={cn("truncate pt-1 text-[9px] font-semibold uppercase tracking-[0.08em]", theme.text)}>
          {node.team}
        </p>
      </div>
    </div>
  );
}

export default function DepartmentOrgChart({
  members,
}: {
  members: DepartmentMember[];
}) {
  const root = useMemo(() => buildTree(members), [members]);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);

  const layout = useMemo(() => {
    if (!root) return null;
    return buildLayout(root);
  }, [root]);

  useEffect(() => {
    if (!layout || !viewportRef.current) return;

    const viewportWidth = viewportRef.current.clientWidth;
    const centeredX = Math.max(24, (viewportWidth - layout.width * zoom) / 2);
    setPan({ x: centeredX, y: 24 });
  }, [layout]);

  useEffect(() => {
    if (!isDragging) return;

    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;

    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";

    return () => {
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
    };
  }, [isDragging]);

  if (!layout) {
    return null;
  }

  const zoomLabel = `${Math.round(zoom * 100)}%`;

  const applyZoom = (nextZoom: number) => {
    startTransition(() => {
      setZoom(Number(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom)).toFixed(2)));
    });
  };

  const handleZoomIn = () => applyZoom(zoom + ZOOM_STEP);
  const handleZoomOut = () => applyZoom(zoom - ZOOM_STEP);
  const handleReset = () => {
    setZoom(1);
    if (viewportRef.current) {
      const viewportWidth = viewportRef.current.clientWidth;
      setPan({
        x: Math.max(24, (viewportWidth - layout.width) / 2),
        y: 24,
      });
    }
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? -1 : 1;
    applyZoom(zoom + direction * ZOOM_STEP);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    event.preventDefault();

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;

    event.preventDefault();

    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;

    setPan({
      x: dragRef.current.panX + deltaX,
      y: dragRef.current.panY + deltaY,
    });
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div className="max-w-full min-w-0">
      <div
        ref={viewportRef}
        className={cn(
          "relative h-[calc(100vh-13rem)] max-h-[900px] min-h-[560px] max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-50 select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4">
          <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
            <span className="inline-block size-2 rounded-full bg-sky-400" />
            Scroll to zoom and drag to pan
          </div>
          <div
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/80 bg-white/90 p-2 shadow-[0_12px_36px_rgba(15,23,42,0.12)] backdrop-blur-md"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out org chart"
              className="rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <Minus />
            </Button>
            <div className="min-w-16 rounded-full bg-slate-900 px-4 py-1.5 text-center text-sm font-semibold text-white shadow-inner">
              {zoomLabel}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in org chart"
              className="rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <Plus />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="rounded-full border border-transparent px-3 text-slate-500 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <RotateCcw />
              Reset
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "absolute left-0 top-0 origin-top-left touch-none",
            isDragging ? "" : "transition-transform duration-150 ease-out",
          )}
          style={{
            width: layout.width,
            height: layout.height,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <svg
            className="absolute left-0 top-0 overflow-visible"
            width={layout.width}
            height={layout.height}
          >
            {layout.edges.map((edge, index) => {
              const midY = edge.fromY + (edge.toY - edge.fromY) / 2;
              const path = [
                `M ${edge.fromX} ${edge.fromY}`,
                `L ${edge.fromX} ${midY}`,
                `L ${edge.toX} ${midY}`,
                `L ${edge.toX} ${edge.toY}`,
              ].join(" ");

              return (
                <path
                  key={`${edge.fromX}-${edge.toX}-${index}`}
                  d={path}
                  fill="none"
                  stroke={edge.color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
          </svg>

          {layout.nodes.map((node) => (
            <OrgCard key={node.id} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
}
