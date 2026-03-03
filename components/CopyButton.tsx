'use client';

export default function CopyButton({ text, children }: { text: string; children: React.ReactNode; }) {
    return (
        <button type="button" className="active:opacity-50" onClick={() => navigator.clipboard.writeText(text)}>
            {children}
        </button>
    );
}
