# Secret Santa
Welcome to Secret Santa!
## Project structure
### `frontend/`
A Vue 3 project, using Vite, Typescript, SCSS, and Vue Router
### `backend/`
There is no framework managing this folder, but the basic idea is that `src/` will contain all our lambda code.
### `cdk/`
An AWS CDK managed project. CDK will allow us to programmatically define how to deploy assets to AWS, and do the work of automatically detecting changes to the configuration and updating existing assets accordingly. 
Makes it especially easy to deploy the same stack to multiple accounts, so everyone could in theory deploy a personal version of the API/website to test.