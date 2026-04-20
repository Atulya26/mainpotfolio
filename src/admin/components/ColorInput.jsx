import { Input } from './ui.jsx'

export default function ColorInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-9 shrink-0 cursor-pointer rounded-md border border-white/10 bg-transparent p-0"
      />
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="mono-font"
      />
    </div>
  )
}
