
export const api = {
  getUsers: () => new Promise<string[]>((resolve, reject) => {
    fetch('/api/users')
      .then(res => res.json())
      .then(users => resolve(users))
      .catch(reject)
  })
}