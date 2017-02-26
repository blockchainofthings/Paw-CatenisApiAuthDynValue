# Catenis API Authentication Paw Extension

This is a Dynamic Value Paw extension that provides authentication for accessing Blockchain of Things' Catenis API.

## Use

Add the Authorization header, and then add the Dynamic Value as the header value. You will then need to enter your Catenis
device ID and its corresponding API Access Secret. After that, you should be able to successfully authenticate yourself
as that given Catenis device to fulfill the request.

## Development

### Prerequisites

```shell
nvm install
nvm use
npm install
```

### Build

```shell
npm run build
```

### Install

```shell
make install
```

### Test

```shell
npm test
```

## License

This Paw Extension is released under the [MIT License](LICENSE). Feel free to fork, and modify!

Copyright © 2017 Blockchain of Things Inc.
