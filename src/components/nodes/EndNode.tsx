"use client"

import { Handle, Position } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EndNode() {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="text-sm">End Node</CardTitle>
      </CardHeader>
      <CardContent>
        <p>End of conversation</p>
      </CardContent>
      <Handle type="target" position={Position.Top} />
    </Card>
  )
}

