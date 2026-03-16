import type { User } from '@/payload-types'

export const USER_ROLES = ['admin', 'editor'] as const

export type UserRole = (typeof USER_ROLES)[number]

type UserWithRoles =
  | Partial<Pick<User, 'id' | 'roles'>>
  | {
      id?: number | string | null
      roles?: readonly string[] | string[] | null
    }
  | null
  | undefined

export const getUserRoles = (user: UserWithRoles): UserRole[] => {
  if (!user) return []

  if (Array.isArray(user.roles) && user.roles.length > 0) {
    const normalizedRoles: UserRole[] = []

    user.roles.forEach((role) => {
      if (typeof role === 'string' && USER_ROLES.includes(role as UserRole)) {
        normalizedRoles.push(role as UserRole)
      }
    })

    return normalizedRoles
  }

  // Backward-compatible fallback for legacy users before roles are persisted.
  return ['admin']
}

export const hasRole = (user: UserWithRoles, role: UserRole): boolean => {
  return getUserRoles(user).includes(role)
}

export const isAdminUser = (user: UserWithRoles): boolean => hasRole(user, 'admin')

export const isEditorOrAdminUser = (user: UserWithRoles): boolean => {
  return isAdminUser(user) || hasRole(user, 'editor')
}
