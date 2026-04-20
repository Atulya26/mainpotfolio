import { useState } from 'react'
import { Button, Input, Field, Card, CardHeader, CardTitle, CardDescription, toast } from './components/ui.jsx'
import { checkPassword, setPassword, hasPassword, unlock } from './lib/auth.js'
import { Lock } from 'lucide-react'

export default function AdminAuth({ onUnlock }) {
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const needsSetup = !hasPassword()

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      if (needsSetup) {
        if (pw.length < 4) {
          toast('Choose at least 4 characters.', { variant: 'destructive' })
          return
        }
        if (pw !== confirm) {
          toast('Passwords do not match.', { variant: 'destructive' })
          return
        }
        await setPassword(pw)
        unlock()
        toast('Admin password set.', { variant: 'success' })
        onUnlock()
      } else {
        const ok = await checkPassword(pw)
        if (ok) {
          unlock()
          onUnlock()
        } else {
          toast('Incorrect password.', { variant: 'destructive' })
        }
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-root flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <CardTitle>{needsSetup ? 'Set up admin' : 'Admin login'}</CardTitle>
          <CardDescription>
            {needsSetup
              ? 'Pick a password. Stored as a hash in your browser.'
              : 'Enter your admin password to continue.'}
          </CardDescription>
        </CardHeader>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Password">
            <Input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoFocus
              placeholder="••••••••"
            />
          </Field>
          {needsSetup && (
            <Field label="Confirm password">
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
          )}
          <Button type="submit" disabled={busy}>
            {needsSetup ? 'Create & unlock' : 'Unlock'}
          </Button>
          {!needsSetup && (
            <p className="text-center text-[11px] text-white/40">
              Forgot it? Clear <span className="mono-font">portfolio:admin-pw</span> in localStorage.
            </p>
          )}
        </form>
      </Card>
    </div>
  )
}
