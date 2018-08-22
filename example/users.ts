import { uMethods, uRequest, uResponse, uRouter } from '../src'
import { BooksRoute } from './books'

@uRouter({
  prefix: 'users',
  children: [BooksRoute]
})
export class UsersRoute {

  @uMethods.get()
  helloUsers (req: uRequest, res: uResponse) {
    res.send('Here are the users: [John, Jane].')
  }

  @uMethods.post()
  createUser (req: uRequest, res: uResponse) {
    res.send('User created')
  }
}
