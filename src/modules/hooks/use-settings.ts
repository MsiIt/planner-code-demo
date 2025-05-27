import { useUser } from './use-user'

export const useSettings = () => {
  const user = useUser()
  return user?.settings
}
