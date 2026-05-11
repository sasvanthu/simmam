import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/admin/login')({
  beforeLoad: ({ context }) => {
    if (context.auth?.user) {
      throw redirect({
        to: '/admin',
        replace: true,
      })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(email, password)
      if (!success) {
        setError('Invalid email or password')
      } else {
        navigate({ to: '/admin', replace: true })
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.12),transparent_35%),radial-gradient(circle_at_bottom,rgba(220,20,60,0.12),transparent_35%)]" />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-strong rounded-3xl p-8 neon-border">
            <div className="text-center">
              <h1 className="font-display text-4xl font-bold text-yellow-400">
                SIMMAM
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Admin Control Center
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@simmam.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>Demo Credentials:</p>
              <p>coordinator@simmam.com / admin123</p>
              <p>reg@simmam.com / admin123</p>
              <p>admin@simmam.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}