export type AdminRole = 'coordinator' | 'reg_team' | 'developer_admin'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminRole
  assignedEvent?: string // for coordinator role
}

export interface Permission {
  resource: string
  actions: string[]
}

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  coordinator: [
    { resource: 'events', actions: ['read'] },
    { resource: 'participants', actions: ['read'] },
    { resource: 'checkin', actions: ['create', 'update'] },
  ],
  reg_team: [
    { resource: 'events', actions: ['read', 'update'] },
    { resource: 'participants', actions: ['read', 'update'] },
    { resource: 'checkin', actions: ['create', 'update', 'delete'] },
  ],
  developer_admin: [
    { resource: 'events', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'participants', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'checkin', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'leaderboard', actions: ['read', 'update'] },
    { resource: 'houses', actions: ['read', 'update'] },
    { resource: 'users', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'settings', actions: ['read', 'update'] },
  ],
}

export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/admin/events': [{ resource: 'events', actions: ['read'] }],
  '/admin/participants': [{ resource: 'participants', actions: ['read'] }],
  '/admin/checkin': [{ resource: 'checkin', actions: ['read'] }],
  '/admin/leaderboard': [{ resource: 'leaderboard', actions: ['read'] }],
  '/admin/houses': [{ resource: 'houses', actions: ['read'] }],
  '/admin/users': [{ resource: 'users', actions: ['read'] }],
  '/admin/settings': [{ resource: 'settings', actions: ['read'] }],
}
