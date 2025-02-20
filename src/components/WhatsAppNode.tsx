"use client"

import { useState } from "react"
import { Handle, Position } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function WhatsAppNode({ data }: { data: { label: string } }) {
  const [message, setMessage] = useState(data.label)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="text-sm">WhatsApp Message</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mb-2" />
        ) : (
          <p className="mb-2">{message}</p>
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

