A simple 'proof of concept' typescript transform that takes a typescript source
file and strips out all APIs that contain '@deprecated' in their tsdoc comment.

The output is written back to the same location but with the extension
'.stripped.ts'

### Running the transform

After checking out the repository and in its root, run

```
yarn build
node index
```

This will run the transform on the file `sample/hello.ts` and produce the
output at `sample/hello.stripped.ts`.
