# Welcome to Secret Santa CDK

## To deploy
### Do once before:
Install AWS CLI from [here](https://aws.amazon.com/cli/), on the side bar.
Install the CDK CLI with npm:
```sh
npm install -g aws-cdk  
```
Add your credentials to the aws cli. It will ask for credentials which can be found in the AWS console by going to [Your security credentials](https://us-east-1.console.aws.amazon.com/iam/home#/security_credentials$access_key) and clicking `Create new access key`. You can also create and configure an IAM user, which is a little bit a pain but is safer. `us-west-2` is the closest region to Utah so I recommend using it.
```
aws configure
```
Create the required resources to deploy to CDK:
```bash
cd backend
npm install
cd ../cdk
npm install
python3 build
cdk bootstrap
```

### When you deploy
Do the following to deploy changes to lambdas, etc:
```bash
cd cdk
python3 build
cdk deploy
```

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Install the following
To use CDK, install:
- [The AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions)
- [The CDK CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions)
