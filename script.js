const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
global.XMLHttpRequest = require('xhr2');

// Reading the configuration file
let config;
const configFile = process.argv[2] || 'config.json'; // path to the configuration file passed as a command line argument

try {
    if (configFile.endsWith('.yaml') || configFile.endsWith('.yml')) {
        config = yaml.load(fs.readFileSync(configFile, 'utf8'));
    } else if (configFile.endsWith('.json')) {
        config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    } else {
        throw new Error('Unsupported config file format. Use JSON or YAML.');
    }
} catch (err) {
    console.error('Error reading config file:', err.message);
    process.exit(1);
}

// Dynamically loading the proto file
const proto = require(path.resolve(config.protoGenFile));

// Setting default values if not provided
const rps = config.rps || 10;
const duration = (config.duration || 3600) * 1000; // Duration in milliseconds
const interval = 1000 / rps;

function makeRequest(client, methodName, requestType, payload) {
    return new Promise((resolve, reject) => {
        const request = new requestType();

        for (const key in payload) {
            if (payload.hasOwnProperty(key) && typeof request['set' + key.charAt(0).toUpperCase() + key.slice(1)] === 'function') {
                request['set' + key.charAt(0).toUpperCase() + key.slice(1)](payload[key]);
            }
        }

        client[methodName](request, {}, (err, response) => {
            if (err) {
                console.error(`${methodName} Error: ${err.message}`);
                reject(err);
                return;
            }
            console.log(`${methodName} Response: ${response.toObject()}`);
            resolve(response);
        });
    });
}

config.requests.forEach((requestConfig) => {
    const clientClass = proto[requestConfig.serviceName];
    const requestType = proto[requestConfig.requestType];

    if (!clientClass) {
        console.error(`Error: Service ${requestConfig.serviceName} not found in proto file`);
        return;
    }

    if (!requestType) {
        console.error(`Error: Request type ${requestConfig.requestType} not found in proto file`);
        return;
    }

    const client = new clientClass(requestConfig.address, null, null);

    const startTime = Date.now();
    const endTime = startTime + duration;

    let totalRequests = 0;

    const intervalId = setInterval(() => {
        const now = Date.now();
        if (now >= endTime) {
            clearInterval(intervalId);
            return;
        }

        const promises = [];
        for (let j = 0; j < rps; j++) {
            promises.push(makeRequest(client, requestConfig.methodName, requestType, requestConfig.payload));
            totalRequests++;
        }

        Promise.all(promises)
            .then(() => {
                console.log('Batch completed');
            })
            .catch((err) => {
                console.error('Batch error:', err);
            });
    }, interval);
});
