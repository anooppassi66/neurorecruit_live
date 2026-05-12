"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect } from "react"
import {
  Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight,
  Heading2, Heading3,
  Minus,
} from "lucide-react"

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function ToolbarButton({
  onClick, active, title, children,
}: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "bg-[#2e5090] text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder ?? "Write job description…" }),
    ],
    immediatelyRender: false,
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none text-gray-800",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.isEmpty ? "" : editor.getHTML())
    },
  })

  // Sync value in when the form resets (e.g. switching from edit → new)
  useEffect(() => {
    if (!editor) return
    const current = editor.isEmpty ? "" : editor.getHTML()
    if (value !== current) {
      editor.commands.setContent(value || "", false)
    }
  }, [value, editor])

  if (!editor) return null

  const btn = (title: string, active: boolean, onClick: () => void, Icon: React.ElementType) => (
    <ToolbarButton key={title} title={title} active={active} onClick={onClick}>
      <Icon className="h-4 w-4" />
    </ToolbarButton>
  )

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#2e5090]/20 focus-within:border-[#2e5090] transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50">
        {/* Text style */}
        {btn("Bold", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), Bold)}
        {btn("Italic", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), Italic)}
        {btn("Underline", editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), UnderlineIcon)}

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Headings */}
        {btn("Heading 2", editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), Heading2)}
        {btn("Heading 3", editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), Heading3)}

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Lists */}
        {btn("Bullet list", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), List)}
        {btn("Numbered list", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), ListOrdered)}

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Alignment */}
        {btn("Align left", editor.isActive({ textAlign: "left" }), () => editor.chain().focus().setTextAlign("left").run(), AlignLeft)}
        {btn("Align center", editor.isActive({ textAlign: "center" }), () => editor.chain().focus().setTextAlign("center").run(), AlignCenter)}
        {btn("Align right", editor.isActive({ textAlign: "right" }), () => editor.chain().focus().setTextAlign("right").run(), AlignRight)}

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Divider */}
        {btn("Horizontal rule", false, () => editor.chain().focus().setHorizontalRule().run(), Minus)}
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}
