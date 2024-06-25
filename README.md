# Load Testing Tool

This load testing tool is designed to test the performance and stability of your gRPC-based services. It allows you to specify various parameters such as concurrent users, requests per second (RPS), duration, and ramp-up time to simulate real-world load conditions.

## Requirements

- Node.js
- gRPC-Web

## Setup

1. Clone the repository.
2. Install the necessary dependencies.

```sh
npm install
```

3. Ensure you have the gRPC-Web proto files generated and available in the specified directory.

## Configuration

Create a configuration file in JSON or YAML format. Below is an example configuration file (`config.json`):

```json
{
  "protoFile": "./src/example_grpc_web_pb.js",
  "requests": [
    {
      "endpoint": "DOMAIN or HOST:PORT",
      "serviceName": "ExampleServiceClient",
      "methodName": "getExampleData",
      "requestType": "GetExampleDataRequest",
      "responseType": "GetExampleDataResponse",
      "payload": {
        "field1": "test_field_1",
        "field2": "test_field-2"
      }
    },
    {
      "endpoint": "DOMAIN or HOST:PORT",
      "serviceName": "ExampleServiceClient2",
      "methodName": "getExampleData2",
      "requestType": "GetExampleDataRequest2",
      "responseType": "GetExampleDataResponse2",
      "payload": {
        "field3": "test_field_3",
        "field4": "test_field-4"
      }
    }
  ],
  "concurrentUsers": 10,
  "duration": 3600,  // Duration in seconds
  "rampUpTime": 600, // Ramp-Up Time in seconds
  "rps": 10          // Requests Per Second
}
```

Configuration
An example configuration file -> (config.json)

## Configuration Parameters

1. `protoGenFile`: Path to the generated gRPC-Web proto file.
2. `requests`: Array of request configurations.
    1. `address`: The gRPC server domain or host:ip.
    2. `serviceName`: The name of the gRPC service client.
    3. `methodName`: The method to be called on the service client.
    4. `requestType`: The request message type.
    5. `responseType`: The response message type.
    6. `payload`: The payload for the request.
3. `concurrentUsers`: Number of concurrent users (threads) to simulate.
4. `duration`: Duration of the test in seconds.
5. `rampUpTime`: Time in seconds to gradually increase the load to the target RPS.
6. `rps`: Requests per second.

## Running the Tool
To run the load testing tool, use the following command:

```sh
node script.js config.json
```