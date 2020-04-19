### TEMPLATE_CAPS ROUTE

- **GET LIST OF TEMPLATE_CAPS**
  - URL:
    - **`GET`** *`/TEMPLATE_ROUTE`*
  - URL (filtered):
    - **`GET`** *`/TEMPLATE_ROUTE?search=<KEYWORD>`*
  - Expected response (status: `200`):
    ```javascript
    {
      [
        {
          "_id": "<id>",//backless-add-model
          "created": "<date>",
          "updated": "<date>"
        }
      ]
    }
    ```
  - Error responses:
    - status: `404`:
      ```javascript
        {
          "message": "..."
        }
      ```

- **CREATE NEW TEMPLATE_CAPS**
  - URL:
    - **`POST`** *`/TEMPLATE_ROUTE`*
  - Header(s):
    - `token`: `String`
  - Body://backless-add-body
  - Expected response (status: `201`):
    ```javascript
      {
        "message": "Template created successfully.",
        "TEMPLATE":
        {
          "_id": "<id>",//backless-add-model
          "created": "<date>",
          "updated": "<date>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```javascript
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
      - ERROR `400` is also Validation Error caused by entering *empty name* or *empty price* or *empty stock* or *negative value price* or or *negative value stock*
    - status: `401`:
      ```javascript
      {
        "message": "unauthorized to access"
      }
      ```
    
- **GET TEMPLATE_CAPS BY ID**
  - URL:
    - **`GET`** *`/TEMPLATE_ROUTE/:id`*
  - Expected response (status: `200`):
    ```javascript
      {
        {
          "_id": "<id>",//backless-add-model
          "created": "<date>",
          "updated": "<date>"
        }
      }
    ```
  - Error responses:
    - status: `404`:
      ```javascript
        {
          "message": "data not found"
        }
      ```

- **UPDATE TEMPLATE_CAPS BY ID**
  - URL(s):
    - **`PUT`** *`/TEMPLATE_ROUTE/:id`*
    - **`PATCH`** *`/TEMPLATE_ROUTE/:id`*
    <br>Notes:
        - `PUT` method is used for updating all details of data
        - `PATCH` method is used for updating some details of data
  - Header(s):
    - `token`: `String`
  - Body://backless-add-body
  - Expected response (status: `201`):
    ```javascript
      {
        "message": "Template Has been updated",
        "updatedTEMPLATE":
        {
          "_id": "<objectID>",//backless-add-model
          "created": "<date>",
          "updated": "<date>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```javascript
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
      - ERROR `400` is also Validation Error caused by entering *empty name* or *empty price* or *empty stock* or *negative value price* or or *negative value stock*
    - status: `401`:
      ```javascript
      {
        "message": "unauthorized to access"
      }
      ```
    - status: `404`:
      ```javascript
        {
          "message": "Data not found"
        }
      ```

- **DELETE TEMPLATE_CAPS BY ID**
  - URL(s):
    - **`DELETE`** *`/TEMPLATE_ROUTE/:id`*
  - Header(s):
    - `token`: `String`
  - Expected response (status: `200`):
    ```javascript
      {
        "message": "Template has been deleted.",
        "deletedTEMPLATE":
        {
          "_id": "<id>",//backless-add-model
          "created": "<createdAt>",
          "updated": "<updatedAt>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```javascript
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
    - status: `401`:
      ```javascript
      {
        "message": "unauthorized to access"
      }
      ```
    - status: `404`:
      ```javascript
        {
          "message": "data not found"
        }
      ```

[comment]: # (reserved for adding new model)