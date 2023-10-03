function catchAll(request, h) {
  const { response } = request

  if (!response.isBoom) {
    return h.continue
  }

  const statusCode = response.output.statusCode

  return h
    .view('error/index', {
      heading: statusCode,
      message: statusCode === 404 ? 'Page not found' : 'Something went wrong'
    })
    .code(statusCode)
}

export { catchAll }
