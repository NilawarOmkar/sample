import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function NodeSettingsPanel({ node, onSave, onClose }: {
  node: Node;
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const [config, setConfig] = useState(node.data);

  return (
    <Dialog open={!!node} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure {node.type} Node</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="content">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="space-y-4">
              <div>
                <Label>Message Content</Label>
                <Textarea
                  value={config.content}
                  onChange={(e) => setConfig({ ...config, content: e.target.value })}
                  placeholder="Enter your WhatsApp message..."
                  rows={5}
                />
              </div>
            </div>
          </TabsContent>

          {/* Add other tab content */}
        </Tabs>

        <Button onClick={() => onSave(config)}>Save Changes</Button>
      </DialogContent>
    </Dialog>
  );
}