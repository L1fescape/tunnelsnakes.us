import * as React from 'react'
import { api } from '../../utils'

export interface AppProps {
}

export const App: React.FC<AppProps> = () => {
  const [users, setUsers] = React.useState<string[]>([])
  React.useEffect(() => {
    api.getUsers().then(users => setUsers(users))
  }, [])

  return (
    <>
      <div>🐍 snakes:</div>
      {users.map(user => <li key={user}><a href={`/${user}`}>{user}</a></li>)}
    </>
  )
}
