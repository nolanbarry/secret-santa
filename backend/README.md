## Backend

To install node packages:
```bash
cd backend
npm install <package>
```

The structure here is pretty loose, I just added the folders manually. When deploying to AWS, CDK will package the `src/` folder and upload it to lambda, and `node_modules` will be packaged as a [layer](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-concepts.html#gettingstarted-concepts-layer) and uploaded as a dependency of the lambdas.

Because AWS lambdas don't support Typescript, we'll have to transpile it into JS, which will be placed in the `build/` folder. Similarly, `node_modules/` will be copied over into `layer/nodejs/node_modules`. That will all be managed in the CDK folder.