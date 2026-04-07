import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? '' }),
    ],
    content,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html === '<p></p>' ? '' : html);
    },
  });

  // Sync when content is reset externally (e.g. form clear after submit)
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const current = editor.getHTML();
      const normalised = current === '<p></p>' ? '' : current;
      if (normalised !== content) {
        editor.commands.setContent(content || '', { emitUpdate: false });
      }
    }
  }, [content, editor]);

  const btn = (label: string, title: string, active: boolean, action: () => void) => (
    <button type="button" title={title} className={active ? 'active' : ''} onClick={action}>
      {label}
    </button>
  );

  return (
    <div className="rich-editor">
      <div className="rich-toolbar">
        {editor && (<>
          {btn('B', 'Bold', editor.isActive('bold'), () => editor.chain().focus().toggleBold().run())}
          {btn('I', 'Italic', editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run())}
          {btn('≡', 'Bullet list', editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run())}
        </>)}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
