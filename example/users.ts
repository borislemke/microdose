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

  @uMethod.get('/:userName')
  getUser (req: uRequest, res: uResponse) {
    res.send('You are looking for this? ' + req.params.userName)
  }

  @uMethod.post()
  createUser (req: uRequest, res: uResponse) {
    console.log('req.body', req.body)
    res.send('User created')
  }
}
