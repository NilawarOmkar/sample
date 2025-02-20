import { Handle, Position } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';
import { MessageSquareTextIcon } from 'lucide-react';

export function MessageNode({ data }: { data: any }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <HoverCard>
          <HoverCardTrigger>
            <Card className="w-64 border-blue-300 shadow-lg">
              <CardHeader className="pb-2 bg-blue-50">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquareTextIcon className="h-4 w-4" />
                  Message Node
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-sm">
                {data.content || 'Click to edit message'}
              </CardContent>
            </Card>
          </HoverCardTrigger>
          
          <HoverCardContent side="right" className="w-64">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Message Preview</h4>
              <p className="text-sm text-muted-foreground">
                {data.content || 'No content configured'}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>Edit</ContextMenuItem>
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuItem className="text-red-600">Delete</ContextMenuItem>
      </ContextMenuContent>
      
      <Handle type="target" position={Position.Top} className="!bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
    </ContextMenu>
  );
}