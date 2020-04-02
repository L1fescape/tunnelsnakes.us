import * as path from 'path'
import * as express from 'express'

export interface ServerConfig {
  port: string
  onReady(): void
  onGetAllUsers(): Promise<string[]>
  onGetUserContent(username: string): Promise<string>
}

export interface TunnelSnakesServer {
  (config: ServerConfig): express.Express
}

export const Server: TunnelSnakesServer = ({
  port,
  onReady,
  onGetAllUsers,
  onGetUserContent,
}) => {
  const app = express()
  const webDist = path.resolve(__dirname, '../../build/web')
  app.use(express.static(webDist))

  app.get("/api/users", async (_, res, next) => {
    const users = await onGetAllUsers().catch(err => next(err))
    res.json(users)
  })

  app.get("/:username", async (req, res, next) => {
    const { params: { username } } = req
    const userContent = await onGetUserContent(username).catch(err => next(err))
    if (!userContent) {
      res.send('not found<br /><br />← <a href="/">back</a>')
      return
    }
    res.send(userContent)
  })

  app.get("*", (_, res) => {
    res.sendFile(path.resolve(webDist, 'index.html'))
  })

  app.listen(port, function() {
    console.log(`express server initialized: ${port}`)
    onReady()
  })

  return app
}