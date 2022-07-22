# Tracker Example

## Installation and building

```bash
$ npm ci

$ npm run build
```

## Running the service

```
# development mode with watching
$ npm run dev

# production mode
$ npm run start
```

### Environment variables


`BACKEND_PORT` (defaults to `8001`) is a port the backendservice will be using

`FRONTEND_PORT` (defaults to `8000`) is a port the frontend service will be using

`MONGODB_URI` (defaults to `mongodb://localhost:27017/tracker`) is a connection string for MongoDB

## Requirements

Running MongoDB is required. You can also start a mongo from container using `docker-compose up`.
