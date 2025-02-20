"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InputNode({ data }: { data: { label: string } }) {
  const [inputLabel, setInputLabel] = useState(data.label)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="text-sm">Input Node</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <>
            <Label htmlFor="inputLabel">Input Label</Label>
            <Input
              id="inputLabel"
              value={inputLabel}
              onChange={(e) => setInputLabel(e.target.value)}
              className="mb-2"
            />
          </>
        ) : (
          <p className="mb-2">Ask for: {inputLabel}</p>
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

