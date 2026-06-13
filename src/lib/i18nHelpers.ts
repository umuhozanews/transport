import { useTranslation } from 'react-i18next'
import type { Role } from '../store/AuthContext'

export function useStatusLabel(value: string) {
  const { t } = useTranslation()
  return t(`status.${value}`, { defaultValue: value })
}

export function useRoleLabel(role: Role) {
  const { t } = useTranslation()
  return t(`roles.${role}`)
}

export function useModuleLabel(module: string) {
  const { t } = useTranslation()
  return t(`modules.${module}`, { defaultValue: module })
}
