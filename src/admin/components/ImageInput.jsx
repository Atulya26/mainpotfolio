import { useRef } from 'react'
import { Input, Button } from './ui.jsx'
import { ImageIcon, Upload, X } from 'lucide-react'

export default function ImageInput({ value, onChange, aspect = '16/10' }) {
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative flex items-center justify-center rounded-md border border-dashed border-white/15 bg-white/[0.02] overflow-hidden"
        style={{ aspectRatio: aspect }}
      >
        {value ? (
          <>
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              onClick={() => onChange('')}
              className="absolute right-2 top-2 rounded-md bg-black/60 p-1 text-white opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
              style={{ opacity: 0.9 }}
              title="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-white/40">
            <ImageIcon className="h-6 w-6" />
            <p className="text-xs">Paste image URL or upload</p>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="https://…"
          value={value?.startsWith('data:') ? '' : value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
          className="shrink-0"
          title="Upload (stored locally; publish will not push binary to GitHub)"
        >
          <Upload className="h-3.5 w-3.5" />
        </Button>
      </div>
      {value?.startsWith('data:') && (
        <p className="text-[10px] text-amber-400/80">
          Local upload preview. For publishing, use a hosted URL (CDN, Unsplash, Cloudinary).
        </p>
      )}
    </div>
  )
}
