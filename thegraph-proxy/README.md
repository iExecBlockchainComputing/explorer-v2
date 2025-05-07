# TheGraph Proxy

> ⚠️ Use this component for development purpose only

Proxy server component relaying the calls to the decentralized thegraph network

## Usage

### prepare the `.env` file

```sh
cp .env.template .env
```

fill in `THEGRAPH_API_KEY` in the generated [.env](.env)

### launch the **thegraph-proxy** service

```sh
docker compose up -d
```

The service is available at <http://localhost:8080>

### use the service to query a subgraph

example

```js
curl --request POST \
  --url http://localhost:8080/subgraphs/id/2GCj8gzLCihsiEDq8cYvC5nUgK6VfwZ6hm3Wj8A3kcxz \
  --data '{"query":"query {\n\t_meta {\n\t\tdeployment\n\t\thasIndexingErrors\n\t\tblock {\n\t\t\tnumber\n\t\t}\n\t}\n}\n"}'
```

### stop the service

```sh
docker compose down
```
