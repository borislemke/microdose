import { uMethod, uRequest, uResponse, uRouter } from '../src'
import { BooksRoute } from './books'

@uRouter({
  prefix: 'users',
  children: [BooksRoute]
})
export class UsersRoute {

  @uMethod.get()
  helloUsers (req: uRequest, res: uResponse) {
    res.send('Here are the users: [John, Jane].')
  }

  @uMethod.post()
  createUser (req: uRequest, res: uResponse) {
    console.log('req.body', req.body)
    res.send('User created')
  }
}
