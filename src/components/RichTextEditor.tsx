import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: Props) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder ?? '' }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
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

  function getBlockStyle() {
    if (!editor) return 'p';
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    return 'p';
  }

  function handleBlockStyleChange(value: string) {
    if (!editor) return;
    if (value === 'p') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(value[1]) as 1 | 2 | 3;
      editor.chain().focus().setHeading({ level }).run();
    }
  }

  function handleLinkClick() {
    if (!editor) return;
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    setLinkUrl('');
    setShowLinkInput(true);
  }

  function applyLink() {
    if (!editor) return;
    const raw = linkUrl.trim();
    if (raw) {
      const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      editor.chain().focus().setLink({ href }).run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  }

  const btn = (label: string, title: string, active: boolean, action: () => void) => (
    <button type="button" title={title} className={active ? 'active' : ''} onClick={action}>
      {label}
    </button>
  );

  return (
    <div className="rich-editor">
      <div className="rich-toolbar">
        {editor && (<>
          {/* Block style */}
          <select
            className="rich-style-select"
            value={getBlockStyle()}
            onChange={e => handleBlockStyleChange(e.target.value)}
            title="Text style"
          >
            <option value="p">Body</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <span className="rich-toolbar-sep" />

          {/* Inline formatting */}
          {btn('B',  'Bold',      editor.isActive('bold'),      () => editor.chain().focus().toggleBold().run())}
          {btn('I',  'Italic',    editor.isActive('italic'),    () => editor.chain().focus().toggleItalic().run())}
          {btn('U',  'Underline', editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run())}

          <span className="rich-toolbar-sep" />

          {/* Lists */}
          {btn('≡',  'Bullet list',   editor.isActive('bulletList'),  () => editor.chain().focus().toggleBulletList().run())}
          {btn('1.', 'Ordered list',  editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run())}

          <span className="rich-toolbar-sep" />

          {/* Link */}
          {btn('⛓', 'Link', editor.isActive('link'), handleLinkClick)}
        </>)}
      </div>

      {/* Link input row */}
      {showLinkInput && (
        <div className="rich-link-row">
          <input
            type="url"
            className="rich-link-input"
            placeholder="https://..."
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
              if (e.key === 'Escape') { setShowLinkInput(false); setLinkUrl(''); }
            }}
            autoFocus
          />
          <button type="button" className="rich-link-apply" onClick={applyLink}>Apply</button>
          <button type="button" onClick={() => { setShowLinkInput(false); setLinkUrl(''); }}>✕</button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
