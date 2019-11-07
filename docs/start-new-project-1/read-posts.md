# Posts Postman snippet

CRUD

> [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/648e29eb55b4a26be732)

## Create

```text
curl -X POST \  http://localhost:3030/posts \  -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOiI1Y2JjNTRmMDk1ZDcxNDJmN2NkNTBhZjQiLCJpYXQiOjE1NTYxMzkxNDAsImV4cCI6MTU1NjIyNTU0MCwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiYW5vbnltb3VzIiwianRpIjoiNTczMGJlNmQtNDc0NS00ZjgzLWEyZWQtZjY3ODlhZDk1NTcxIn0.U7t13Qc_5vzp6gqAYvNagffe4q-8UnUq5HgP81rCNqE' \  -H 'Content-Type: application/json' \  -H 'Postman-Token: b30daf91-d8ac-40a5-9e6f-b0e258723e4b' \  -H 'cache-control: no-cache' \  -d '{	"title": "My Title",	"body": "My Body Text",	"author": "5cbc54f095d7142f7cd50af4"}'
```

## Read

```text
curl -X GET \  http://localhost:3030/posts \  -H 'Postman-Token: a545a422-9c98-467c-ba5b-51b21ada023c' \  -H 'cache-control: no-cache'
```

## Update

```text
curl -X PATCH \  http://localhost:3030/posts/5cc0d419923b64287c9a98c6 \  -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOiI1Y2JjNTRmMDk1ZDcxNDJmN2NkNTBhZjQiLCJpYXQiOjE1NTYxMzkxNDAsImV4cCI6MTU1NjIyNTU0MCwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiYW5vbnltb3VzIiwianRpIjoiNTczMGJlNmQtNDc0NS00ZjgzLWEyZWQtZjY3ODlhZDk1NTcxIn0.U7t13Qc_5vzp6gqAYvNagffe4q-8UnUq5HgP81rCNqE' \  -H 'Content-Type: application/json' \  -H 'Postman-Token: 99a7ab2d-6d6d-414b-baf2-6cc9a4fb2f2e' \  -H 'cache-control: no-cache' \  -d '{	"title": "My New Title"}'
```

## Delete

```text
curl -X DELETE \  http://localhost:3030/posts/5cc0d4ad923b64287c9a98c7 \  -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOiI1Y2JjNTRmMDk1ZDcxNDJmN2NkNTBhZjQiLCJpYXQiOjE1NTYxMzkxNDAsImV4cCI6MTU1NjIyNTU0MCwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiYW5vbnltb3VzIiwianRpIjoiNTczMGJlNmQtNDc0NS00ZjgzLWEyZWQtZjY3ODlhZDk1NTcxIn0.U7t13Qc_5vzp6gqAYvNagffe4q-8UnUq5HgP81rCNqE' \  -H 'Content-Type: application/json' \  -H 'Postman-Token: 74abe06f-a2a2-4b64-b61f-3b476bb87bd8' \  -H 'cache-control: no-cache'
```

