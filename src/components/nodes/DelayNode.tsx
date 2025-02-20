"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DelayNode({ data }: { data: { label: string } }) {
  const [delay, setDelay] = useState(data.label)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="text-sm">Delay Node</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <>
            <Label htmlFor="delay">Delay (seconds)</Label>
            <Input id="delay" type="number" value={delay} onChange={(e) => setDelay(e.target.value)} className="mb-2" />
          </>
        ) : (
          <p className="mb-2">Wait for: {delay} seconds</p>
        )}
        <Button onClick={() => setIsEditing(!isEditing)} variant="outline" size="sm">
          {isEditing ? "Save" : "Edit"}
        </Button>
      </CardContent>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  )
}

