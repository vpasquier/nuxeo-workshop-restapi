Nuxeo Workshop REST API
========

# Client Library for Nuxeo API

The JavaScript client library for the Nuxeo Automation and REST API.

The library can work in a browser (jQuery), or in Node.js, using the same API.

# Getting Started

## Setup

Distribution and Dev mode setup:
- Get a nuxeo distribution.
- Move the client jar `nuxeo-training-jsclient-workshop-1.0-SNAPSHOT.jar` into `NUXEO_HOME/nxserver/bundles` folder.
- Go to `NUXEO_HOME/bin` folder.
- Execute `./nuxeoctl register`.
- Install Web UI at `./nuxeoctl mp-install nuxeo-web-ui`.
- Install JSF UI at `./nuxeoctl mp-install nuxeo-jsf-ui`.
- Open `NUXEO_HOME/bin/nuxeo.conf` file.
- Remove the line `wizard.done=false`.
- Uncomment `org.nuxeo.dev=true`.
- Install the Nuxeo chrome extension.

Nuxeo Execution and Studio custom bundle setup:
- Execute `./nuxeoctl console`.
- Create into your project one document type:
  - Named `Meeting`
  - With one metadata `participants` String multivalued
  - And one metadata `meetingPublisher` complex containing `firstName` and `lastName` String
- Hotreload

Finally
- Navigate with your web browser to `http://localhost:8080/nuxeo/restapi/index.html`.
- Then to the client app: `http://localhost:8080/nuxeo/restapi/restapi.html`.
- Open/Edit `nuxeo/nxserver/nuxeo.war/restapi/restapi.js` (or `nuxeo\nxserver\nuxeo.war\restapi\restapi.js`)
- And refresh `http://localhost:8080/nuxeo/restapi/restapi.html` after coding.

Warning

Don't hotreload or restart your server during the workshop, you could loose your work done.

If you use the sample 'outside' Nuxeo server, you have to create a `cors-config.xml` into `NUXEO_HOME/nxserver/config` folder with the following contribution:

```
<?xml version="1.0"?>
<component name="org.nuxeo.cors">
  <extension target="org.nuxeo.ecm.platform.web.common.requestcontroller.service.RequestControllerService" point="corsConfig">
    <corsConfig name="foobar" allowOrigin="*" supportedMethods="GET, POST, PUT, DELETE, HEAD, OPTIONS">
      <pattern>.*</pattern>
    </corsConfig>
  </extension>
</component>
```

in order to resolve CORS issues.

## Initialization

#### Create and return a Client in `RestAPI.config = function ()`

To be able to make API calls on a Nuxeo server, you need to create a `Client` object:

```javascript
var client = new nuxeo.Client({
  baseURL: 'http://localhost:8080/nuxeo',
  auth: {
      username: 'Administrator',
      password: 'Administrator'
    }
})

  client.schema("dublincore");
  client.timeout(3000);
  return client;
```

#### Client Methods

**client.timeout(timeout)**
Sets the common timeout in ms to be used for the requests.

**client.header(name, value)**

**client.headers(headers)**

**client.repositoryName(repositoryName)**

**client.schema(schema)**

**client.schemas(schemas)** (`X-NXDocumentProperties` header)

-----------

### 1) Get Administrator user in `RestAPI.getCurrentUser = function ()`

Use `this.client` to get Client for all examples now.

####Request Object

Fetching vpasquier user: (using `user/{userName}` endpoint)

```javascript
this.client.request('user/vpasquier').get(callback)
```
Calling endpoint `path/`

```javascript
var request = this.client.request('path/');
```

You can have access to the following methods.

**request.path(path)**

**request.get(options, callback)**

**request.post(options, callback)**

**request.put(options, callback)**

**request.delete(options, callback)**

### 2) Execute Query in `RestAPI.executeQuery = function (query)`

Use GET method and `query` endpoint with `?query=SELECT * .....` path parameter.

### 3) Get Root Children in `RestAPI.getRootChildren = function ()`

#### Document Object

Fetch the Root document:

```javascript
this.client.document('/').fetch(callback);
```
Create a document:

```
this.client.document('/')
  .create({
    type: 'Folder',
    name: 'My Folder',
    properties: {
      "dc:title": "My Folder",
      "dc:description": "A Simple Folder"
    }
```

You can have access to the following methods.

**document.children(callback)**

**document.fetch(callback)**

**document.create(doc, callback)**

**document.update(data, callback)**

**document.delete(callback)**

**document.set(properties)**

**document.save(callback)**

**document.header(head,value)**

**document.schemas(schemas)**

### 4) Fetch Document in `RestAPI.fetchDocument = function (id)`

### 5) Modify `RestAPI.fetchDocument = function (map)` to get common schema

Use schemas method.

### 6) Modify `RestAPI.fetchDocument = function (map)` to get ACLS

Use content enricher with `X-NXContext-Category` header = "acls".

### 7) Update Document in `RestAPI.updateDocument = function (map)`

Use **document.set(properties)** and **document.save(callback)**
with `this.currentDocument`

### 8) Create Document in `RestAPI.createDocument = function (map)`

Hint:
```
properties: {
"dc:title": map["dc:title"],
"dc:description": map["dc:description"],
"dc:nature": map["dc:nature"],
"dc:language": map["dc:language"]
}
```

### 9) Delete Document in `RestAPI.deleteDocument = function ()`

## Automation API & Files

Retrieving the Root children document:

```javascript
client.operation('Document.GetChildren')
  .input('doc:/')
  .execute(function(error, children) {
    if (error) {
      // something went wrong
      throw error;
    }
    console.log('Root document has ' + children.entries.length + ' children');
  });
```

You can have access to the following methods.

**operation.input(object)**

**operation.param(name, value)**

**operation.params(params)**

**operation.context(context)**

**operation.execute(callback)**

### Uploader API

#### Samples

Upload a blob to an existing document. In this example, `file` is a File JavaScript object, as filled when using the `<input type="file" .../>` HTML object.

```javascript
// Create the uploader bound to the operation
var uploader = client.operation("Blob.Attach")
  .params({ document: existingDocId,
    save : true,
    xpath: "file:content"
  })
  .uploader();

// Upload the file
uploader.uploadFile(file, function(fileIndex, file, timeDiff) {
  // When done, execute the operation
  uploader.execute(function(error, data) {
    if (error) {
      // something went wrong
      throw error;
    }
    
    // successfully attached blob
  });
}
```

### 10) Import file by filling `RestAPI.importFile = function (file)`

Use `FileManager.Import` operation.

### 11) Attach file by filling `RestAPI.attachBlob = function (file)`

Use `Blob.Attach` operation.
