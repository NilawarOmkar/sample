import type React from "react"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <aside className="w-64 p-4 bg-gray-100">
      <h2 className="text-lg font-semibold mb-4">Node Types</h2>
      <div className="space-y-2">
        <Button
          className="w-full"
          variant="outline"
          draggable
          onDragStart={(event) => onDragStart(event, "whatsappNode")}
        >
          WhatsApp Message
        </Button>
        <Button className="w-full" variant="outline" draggable onDragStart={(event) => onDragStart(event, "inputNode")}>
          Input
        </Button>
        <Button
          className="w-full"
          variant="outline"
          draggable
          onDragStart={(event) => onDragStart(event, "conditionNode")}
        >
          Condition
        </Button>
        <Button className="w-full" variant="outline" draggable onDragStart={(event) => onDragStart(event, "apiNode")}>
          API Call
        </Button>
        <Button className="w-full" variant="outline" draggable onDragStart={(event) => onDragStart(event, "delayNode")}>
          Delay
        </Button>
        <Button className="w-full" variant="outline" draggable onDragStart={(event) => onDragStart(event, "endNode")}>
          End
        </Button>
      </div>
    </aside>
  )
}

