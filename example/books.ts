import { HTTPStatusCodes, uMethod, uRequest, uResponse, uRouter } from '../src'
import * as multer from 'multer'
import { resolve } from 'path'
import { uMiddleware } from '../src/middleware'
import { copyFile, unlink } from 'fs'

const upload = multer({
  dest: resolve(__dirname, '../.tmp/uploads/')
})

export interface IRequestWithFile extends uRequest {
  file: {
    fieldname: string // 'avatar',
    originalname: string // '420.png',
    encoding: string // '7bit',
    mimetype: string // 'image/png',
    destination: string // '/Users/borisl/Projects/microdose/upload-test',
    filename: string // '1e98ce16131573fb71c5b29411e4d7b3',
    path: string // '/Users/borisl/Projects/microdose/upload-test/1e98ce16131573fb71c5b29411e4d7b3',
    size: number // 6115866
  }
}

@uRouter({
  prefix: 'books'
})
export class BooksRoute {

  @uMethod.get()
  getBooks (req: uRequest, res: uResponse) {
    res.send('Books: Kama Sutra, The Design of Everyday Objects')
  }

  @uMethod.post()
  @uMiddleware(upload.single('avatar'))
  uploadAvatar (req: IRequestWithFile, res: uResponse) {
    copyFile(req.file.path, resolve(__dirname, 'uploads', req.file.originalname), err => {
      if (err) {
        return void res.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).send('Error copy')
      }

      unlink(req.file.path, err => {
        if (err) {
          return void res.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).send('Error unlink')
        }

        res.send('Avatar uploaded!')
      })
    })
  }
}
