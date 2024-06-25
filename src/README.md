Here we keep generated proto files.

Command to generate proto files:
```sh
protoc -I=./ YOUR_PROTO_FILE_NAME.proto   --js_out=import_style=commonjs,binary:./src   --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./src
```