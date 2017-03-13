#aoe-raml-validate

## Description

API testing against RAML 1.0 files

## Usage

To install aoe-raml-validate from npm, run:

```
$ npm install -g aoe-raml-validate
```

If you installed it globally, you should be able to run:

```
aoe-raml-validate --help
```

## Getting started

### Setup test cases
Create a new config file in your project dir (e.g. raml-validation.json).
Each item in the config array represents one test case.

```
[
  {
    "name": "GET /products TEST",
    "resource": "/products",
    "request": {
      "path": "/products",
      "method": "get",
      "body": "",
      "cookie": "myCookie=HelloWorld"
    },
    "response": {
      "status": 200
    }
  },
  {
    "name": "GET /products/174 TEST",
    "resource": "/products/{productId}",
    "request": {
      "path": "/products/174",
      "method": "get",
      "body": ""
    },
    "response": {
      "status": 200
    }
  }
]
```

- `name` - Name of the test case
- `resource` - Resource defined in RAML file (has to match exactly)
- `request` - Request to be executed - here you can replace parameters and placeholders
  * `path` - URI path
  * `method` - HTTP method
  * `body` - Request body
  * `cookie` - Optional cookie string
- `response` - Expected response
  * `status` - Expected Response code

Currently the following parts of the response are validated:
* Response code matches the expected response code
* Response JSON matches exactly the RAML type definition. Please note, that currently only RAML TYPES are allowed and have to be defined for each response, which is going to be tested.
* Response header of is "application/json"

### Command Line Options

```
  Usage: aoe-raml-validate [options] [command]

  Commands:

    validate [options] <ramlfile> <server> <configurationfile> validates RAML file against API
    setup [options] [env]  run setup commands for all envs
    completion             Print command completion script
    config [key] [value]   Get and set options

  Options:

    -h, --help     output usage information
    -d, --debug    enable debugger
    -V, --version  output the version number

```

Example
```
aoe-raml-validate validate api/endpoints.raml https://mytestingendpoints.de config.json
```

Example generating report file in jUnit format
```
aoe-raml-validate -o output.xml validate api/endpoints.raml https://mytestingendpoints.de config.json
```

## License

Copyright (c) 2016 AOE GmbH

[MIT License](http://en.wikipedia.org/wiki/MIT_License)