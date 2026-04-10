import { useState, useMemo } from 'react';
import type { Prompt } from '../types';
import { PHASE_COLORS } from '../data';

const LEVELS = [
  { key: 'Utility',          code: '00', label: '000 Utility' },
  { key: '01 Context',       code: '01', label: '001 Context' },
  { key: '02 Capabilities',  code: '02', label: '002 Capabilities' },
  { key: '03 Objects',       code: '03', label: '003 Objects' },
  { key: '04 Interactions',  code: '04', label: '004 Interactions' },
  { key: '05 Alignment',     code: '05', label: '005 Alignment' },
  { key: '06 Build',         code: '06', label: '006 Build' },
];

interface Props {
  prompts: Prompt[];
}

export function PromptLibrary({ prompts }: Props) {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return prompts;
    return prompts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.level.toLowerCase().includes(q)
    );
  }, [prompts, search]);

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function copyPrompt(prompt: Prompt) {
    await navigator.clipboard.writeText(prompt.body);
    setCopied(prompt.id);
    setTimeout(() => setCopied(null), 1800);
  }

  const groupedLevels = LEVELS.map(level => ({
    ...level,
    prompts: filtered.filter(p => p.level === level.key),
  })).filter(level => level.prompts.length > 0);

  return (
    <div className="prompt-library-view">
      <div className="prompt-library-toolbar">
        <div>
          <h2 className="prompt-library-heading">Prompt Library</h2>
          <p className="prompt-library-sub">{prompts.length} prompts across {LEVELS.length} stages</p>
        </div>
        <input
          className="prompt-library-search"
          type="search"
          placeholder="Search prompts…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {groupedLevels.length === 0 && (
        <div className="prompt-library-empty">No prompts match "{search}"</div>
      )}

      {groupedLevels.map(level => {
        const color = PHASE_COLORS[level.code];
        return (
          <div key={level.key} className="prompt-library-group">
            <div className="prompt-library-group-header">
              <span className="prompt-library-group-badge" style={{ background: color.bg, color: color.text }}>
                {level.label}
              </span>
              <span className="prompt-library-group-count">{level.prompts.length} prompt{level.prompts.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="prompt-library-list">
              {level.prompts.map(prompt => {
                const isOpen = expanded.has(prompt.id);
                return (
                  <div key={prompt.id} className="prompt-library-card">
                    <div
                      className="prompt-library-card-header"
                      onClick={() => toggleExpand(prompt.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                        <span className="prompt-code">{prompt.code}</span>
                        <span className="prompt-title">{prompt.title}</span>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </div>

                    {prompt.description && (
                      <div className="prompt-desc">{prompt.description}</div>
                    )}

                    {isOpen && (
                      <>
                        <div className="prompt-body-preview">{prompt.body}</div>
                        <div className="prompt-card-actions">
                          <button
                            onClick={() => copyPrompt(prompt)}
                            className={copied === prompt.id ? 'btn-primary' : ''}
                          >
                            {copied === prompt.id ? 'Copied!' : 'Copy prompt'}
                          </button>
                          {prompt.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginLeft: 4 }}>
                              {prompt.tags.map(t => (
                                <span key={t} className="tag" style={{ fontSize: 10 }}>{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
