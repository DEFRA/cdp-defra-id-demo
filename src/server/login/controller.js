const loginController = {
  options: {
    auth: 'defra-id'
  },
  handler: async (request, h) => h.redirect('/')
}

export { loginController }
