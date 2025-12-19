import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InsertCaptureImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (url: string, nid: string, alt: string) => void;
}

export const InsertCaptureImageDialog = ({
  open,
  onOpenChange,
  onInsert,
}: InsertCaptureImageDialogProps) => {
  const [url, setUrl] = useState("");
  const [nid, setNid] = useState("");
  const [alt, setAlt] = useState("");

  const handleInsert = () => {
    if (url && nid) {
      onInsert(url, nid, alt || "image");
      setUrl("");
      setNid("");
      setAlt("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>插入已註冊的 Capture 圖片</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">圖片 URL</Label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nid">NID (Numbers ID)</Label>
            <Input
              id="nid"
              placeholder="bafybeig..."
              value={nid}
              onChange={(e) => setNid(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              從 Capture App 或 Dashboard 複製 NID
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alt-text">替代文字 (可選)</Label>
            <Input
              id="alt-text"
              placeholder="描述圖片內容"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
          </div>
          {url && (
            <div className="mt-4">
              <Label>預覽</Label>
              <div className="mt-2 rounded-lg overflow-hidden border border-border">
                <img
                  src={url}
                  alt={alt || "preview"}
                  className="w-full h-auto max-h-48 object-contain bg-muted"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleInsert} disabled={!url || !nid}>
            插入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
