import * as fs from 'fs';

export const DBConfig = {
  "database": "mymir",
  "user": "root",
  "password": "developer"
};

export const BasicAuthConfig = {
  "users": {
    "developer": "developer"
  }
};

export const HTTPConfig = {
  "defaultPort": 3000
};


const defaultCertPath = 'ssl';

export const SSLConfig = {
  "enabled": false,
  "defaultPort": 3000,
  "ca": `${defaultCertPath}/server.ca-bundle`,
  "cert": `${defaultCertPath}/server.crt`,
  "key": `${defaultCertPath}/server.key`
};

export const SSLOptions = {
  ca: fs.readFileSync(SSLConfig.ca),
  cert: fs.readFileSync(SSLConfig.cert),
  key: fs.readFileSync(SSLConfig.key)
};
