# Sendgrid commercetools serverless for AWS

[![CircleCI](https://circleci.com/gh/DevgurusSupport/aws-sendgrid-commercetools-connector/tree/master.svg?style=svg)](https://circleci.com/gh/DevgurusSupport/aws-sendgrid-commercetools-connector/tree/master)

Thse sendgrid commercetools serverless connector for AWS, allows you to quickly deploy a cloud service to manage your emails in Sendgrid based on commercetools messaging and subscriptions.

### Requirements

- [Install the Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/installation/)
- [Configure your AWS CLI](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

### Installation

Install the Node.js packages

``` bash
$ npm install
```

### Usage

To run unit tests on your local

``` bash
$ npm test
```

To run the function on your local (this will require passing a message in the event)

``` bash
$ serverless invoke local --function lambda
```

We use Jest to run our tests. You can read more about setting up your tests [here](https://facebook.github.io/jest/docs/en/getting-started.html#content).

Deploy your project

``` bash
$ serverless deploy
```

Deploy a single function

``` bash
$ serverless deploy function --function lambda
```

Once deployed, follow the instructions to set up your commercetools subscription to use this connector [here](https://docs.commercetools.com/http-api-projects-subscriptions.html)
