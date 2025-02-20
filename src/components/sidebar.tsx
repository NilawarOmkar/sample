import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export function Sidebar() {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <ScrollArea className="h-full w-64 border-r bg-muted/40">
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">WhatsApp Components</h3>
        
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'message')}
                className="p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-2">
                  <MessageSquareTextIcon className="h-4 w-4" />
                  Text Message
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              Drag to add text message node
            </TooltipContent>
          </Tooltip>

          {/* Add other node types with similar structure */}
        </div>

        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full" onClick={saveWorkflow}>
            Save Workflow
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}