import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import AccessDenied from '@/components/admin/shared/AccessDenied'
import PageHeader from '@/components/admin/shared/PageHeader'

export const Route = createFileRoute('/admin/_layout/users')({
  component: UsersPage,
})

function UsersPage() {
  const { hasPermission } = useAuth()

  if (!hasPermission('users', 'read')) {
    return <AccessDenied />
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="User Management"
        subtitle="Manage admin users and their roles"
      />

      <div className="glass-strong rounded-3xl p-8">
        <p className="text-muted-foreground">User management functionality coming soon...</p>
      </div>
    </div>
  )
}