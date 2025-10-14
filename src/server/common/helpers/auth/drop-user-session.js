async function dropUserSession() {
  await this.server.app.cache.drop(this.state.userSession.sessionId)
}

export { dropUserSession }
