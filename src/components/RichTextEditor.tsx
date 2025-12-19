import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Bold, Italic, Heading1, Heading2, List, Image, Link, Eye, LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InsertCaptureImageDialog } from "./InsertCaptureImageDialog";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureFileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploadWithCapture, uploading } = useImageUpload();
  const { toast } = useToast();
  const [insertDialogOpen, setInsertDialogOpen] = useState(false);

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      insertText(`\n![${file.name}](${url})\n`);
      toast({ title: "圖片上傳成功" });
    } else {
      toast({ title: "圖片上傳失敗", variant: "destructive" });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCaptureImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast({ title: "正在上傳並註冊到 Numbers Protocol..." });

    const result = await uploadWithCapture(file);
    if (result) {
      insertText(`\n!capture[${file.name}](${result.url})(${result.nid})\n`);
      toast({ title: "圖片已上傳並註冊到 Capture" });
    } else {
      toast({ title: "上傳或註冊失敗", variant: "destructive" });
    }

    // Reset input
    if (captureFileInputRef.current) {
      captureFileInputRef.current.value = "";
    }
  };

  const handleInsertExistingCapture = (url: string, nid: string, alt: string) => {
    insertText(`\n!capture[${alt}](${url})(${nid})\n`);
    toast({ title: "已插入 Capture 圖片" });
  };

  const tools = [
    { icon: Bold, action: () => insertText("**", "**"), title: "粗體" },
    { icon: Italic, action: () => insertText("*", "*"), title: "斜體" },
    { icon: Heading1, action: () => insertText("\n# "), title: "標題 1" },
    { icon: Heading2, action: () => insertText("\n## "), title: "標題 2" },
    { icon: List, action: () => insertText("\n- "), title: "列表" },
    { icon: Link, action: () => insertText("[", "](url)"), title: "連結" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-2 bg-secondary/50 rounded-t-lg border border-b-0 border-border">
        {tools.map(({ icon: Icon, action, title }) => (
          <Button
            key={title}
            type="button"
            variant="ghost"
            size="sm"
            onClick={action}
            title={title}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
        
        {/* Regular image upload */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="插入圖片"
        >
          <Image className="w-4 h-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <div className="w-px bg-border mx-1" />

        {/* Upload and register to Capture */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => captureFileInputRef.current?.click()}
          disabled={uploading}
          title="上傳 Capture 圖片 (自動註冊到 Numbers Protocol)"
          className="gap-1"
        >
          <Image className="w-4 h-4" />
          <Eye className="w-3 h-3" />
        </Button>
        <input
          ref={captureFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleCaptureImageUpload}
          className="hidden"
        />

        {/* Insert existing Capture image */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setInsertDialogOpen(true)}
          disabled={uploading}
          title="插入已註冊的 Capture 圖片"
          className="gap-1"
        >
          <LinkIcon className="w-4 h-4" />
          <Eye className="w-3 h-3" />
        </Button>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="使用 Markdown 撰寫文章內容..."
        className="min-h-[400px] rounded-t-none font-mono text-sm"
      />
      
      <p className="text-xs text-muted-foreground">
        支援 Markdown 語法：# 標題、**粗體**、*斜體*、- 列表、![圖片](url)、[連結](url)、!capture[圖片](url)(nid)
      </p>

      <InsertCaptureImageDialog
        open={insertDialogOpen}
        onOpenChange={setInsertDialogOpen}
        onInsert={handleInsertExistingCapture}
      />
    </div>
  );
};
