export const ensureURIValid = (...routes: string[]) => {

    let route = routes.join('/')

    // Remove leading and trailing slashes
    route = route.replace(/^\/+|\/+$/g, '')

    // Replace multiple slashes with a single slash
    route = route.replace(/\/+/g, '/')

    // Prepend path with leading slash
    return '/' + route
}
