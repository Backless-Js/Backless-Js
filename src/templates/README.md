# Backless Server


Server is built on `Express` and `Mongoose` and `Node Js`

## Usage
To run the development server, you can use these commands:
```console
$ cd server
$ npm run dev
```

Access the REST API via localhost = `http://localhost:<PORT>`


## REST API Routes:

### AUTHENTICATION

- **Register**
  - URL:
    - **`POST`** *`/register`*
  - Body:
    - `fullname`: `String`, required
    - `email`: `String`, required
    - `password`: `String`, required
  - Expected response (status: `201`):
    ```json
      {
        "message": "User has been registered",
        "data":
          {
            "_id": "<generatedId>",
            "fullname": "<registeredName>",
            "email": "<registeredEmail>",
            "password": "<hashedPassword>"
          },
        "access_token" : "<access_token>"
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "<detailedErrors>"
      }
      ```
      Notes:
      - ERROR `400` is caused by entering *empty name* or *empty email* or *duplicated email* or *email not valid format* or *empty password* or *empty role*

- **Login**
  - URL:
    - **`POST`** *`/login`*
  - Body:
    - `email`: `String`, required
    - `password`: `String`, required
  - Expected response (status: `200`):
    ```json
      {
        "access_token": "<access_token>"
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "invalid username / password"
      }
      ```

[comment]: # (reserved for adding new model)