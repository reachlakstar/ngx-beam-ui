# API

## Description

Backend API build with [Nest](https://github.com/nestjs/nest) Framework.

### Generate

> Generate Interfaces from proto

```bash
protoc --plugin=./node_modules/ts-proto/protoc-gen-ts_proto -I./proto  --ts_proto_out=apps/api/src/app/echo/interfaces  ./proto/echo.proto
```

### Run

#### Run Dev Mode

```bash
# start in watch mode
ng serve api
# to turn on logging for `request`
NODE_DEBUG=request ng serve api
DEBUG=typeorm:* ng serve api
# optionally you can run with prod env(environment.prod.ts) for testing! use this for testing only.
ng serve api --prod
```

#### Test Dev Mode

```bash
# test API directly (nestJS)
grpcurl -plaintext \
-protoset <(buf image build -o -) \
-d '{"message": "sumo"}' 0.0.0.0:5000 yeti.echo.v1.EchoService/Echo
# test API via envoy
grpcurl -plaintext  \
-protoset <(buf image build -o -) \
-d '{"message": "sumo"}' 0.0.0.0:9090 yeti.echo.v1.EchoService/Echo
```
