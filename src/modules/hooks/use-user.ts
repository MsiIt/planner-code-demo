import { useQuery } from '~/db'
import { User } from '~/db/models/user'

export const useUser = () => {
  const user = useQuery(User)[0]
  return user
}
