"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type ReactFlowInstance,
} from "reactflow"
import "reactflow/dist/style.css"

import WhatsAppNode from "./nodes/WhatsAppNode"
import InputNode from "./nodes/InputNode"
import ConditionNode from "./nodes/ConditionNode"
import APINode from "./nodes/APINode"
import DelayNode from "./nodes/DelayNode"
import EndNode from "./nodes/EndNode"
import Sidebar from "./Sidebar"

const nodeTypes = {
  whatsappNode: WhatsAppNode,
  inputNode: InputNode,
  conditionNode: ConditionNode,
  apiNode: APINode,
  delayNode: DelayNode,
  endNode: EndNode,
}

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")

      if (typeof type === "undefined" || !type) {
        return
      }

      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowWrapper.current?.getBoundingClientRect().left!,
        y: event.clientY - reactFlowWrapper.current?.getBoundingClientRect().top!,
      })

      if (position) {
        const newNode = {
          id: `${type}-${nodes.length + 1}`,
          type,
          position,
          data: { label: `${type} node` },
        }

        setNodes((nds) => nds.concat(newNode))
      }
    },
    [nodes, setNodes, reactFlowInstance],
  )

  return (
    <div className="flex h-[600px] w-full">
      <Sidebar />
      <div className="flex-grow" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  )
}

