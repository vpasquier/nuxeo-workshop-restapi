var RestAPI = {};

// Root Document
var documentRoot = "/default-domain/workspaces/workspace";

////////////////////////////// NUXEO JS CONFIGURATION

// Configure Nuxeo Client
RestAPI.config = function () {
  //Instantiate Nuxeo Client
  var client = new nuxeo.Client({
    baseURL: 'http://localhost:8080/nuxeo',
    username: 'Administrator',
    password: 'Administrator'
  })

  // Client schema and timeout configuration
  client.schema("dublincore");
  client.timeout(3000);
  return client;
}

////////////////////////////// CURRENT USER

// Callback: callbackCurrentUser
RestAPI.getCurrentUser = function () {
  this.client.request('user/Administrator').get(callbackCurrentUser);
}

////////////////////////////// EXECUTE QUERY

// Callback: callbackQuery
RestAPI.executeQuery = function (query) {
  this.client.request('query/?query=' + query).get(callbackQuery);
}

////////////////////////////// DISPLAY WORKSPACE CHILDREN

// Callback: callbackRootChildren
RestAPI.getRootChildren = function () {
  this.client.document(documentRoot).children(callbackRootChildren);
}


////////////////////////////// DISPLAY DOCUMENT PROPERTIES

// Callback: callbackFetchDocument
RestAPI.fetchDocument = function (id) {
  this.client.document(id).fetch(callbackFetchDocument);
  //this.client.document(id).schemas(["common","dublincore"]).fetch(callbackFetchDocument);
  //this.client.document(id).header('X-NXContext-Category', 'acls').fetch(callbackFetchDocument);
}

////////////////////////////// UPDATE DOCUMENT

// Callback: callbackUpdateDocument
RestAPI.updateDocument = function (map) {
  this.currentDocument.set(map).save(callbackUpdateDocument)
}

////////////////////////////// CREATE DOCUMENT

// Callback: callbackCreateDocument
RestAPI.createDocument = function (map) {
  this.client.document(documentRoot)
    .create({
      type: 'File',
      name: map["dc:title"],
      properties: {
        "dc:title": map["dc:title"],
        "dc:description": map["dc:description"],
        "dc:nature": map["dc:nature"],
        "dc:language": map["dc:language"]
      }
    }, callbackCreateDocument);
}

////////////////////////////// DELETE DOCUMENT

RestAPI.deleteDocument = function () {
  this.currentDocument.delete(callbackDeleteDocument);
}

////////////////////////////// FILE IMPORT

// Callback: callbackImportFile
RestAPI.importFile = function (file) {
  var uploader = this.client.operation("FileManager.Import").context({ currentDocument: documentRoot }).uploader();
  uploader.uploadFile(file, function () {
    uploader.execute(callbackImportFile);
  });
}

////////////////////////////// ATTACH BLOB

// Callback: callbackAttachBlob
RestAPI.attachBlob = function (file) {
  var uploader = this.client.operation("Blob.Attach")
    .params({ document: this.currentDocument.uid, save: true,
      xpath: "file:content"}).uploader();
  uploader.uploadFile(file, function () {
    uploader.execute(callbackAttachBlob)
  });
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// DO NOT EDIT THE CODE BELOW //////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function callbackCreateDocument(error, file) {
  if (error) {
    throwError("Cannot create document -> " + error);
    throw error;
  }
  console.log('Created ' + file.title + ' file')
  location.reload();
}

function importFiles(files) {
  for (var i = 0; i < files.length; i++) {
    RestAPI.importFile(files[i]);
  }
}

function callbackDeleteDocument(error, data) {
  if (error) {
    throwError("Cannot delete document -> " + error);
    throw error;
  }
  location.reload();
  console.log("Document has been deleted");
}

function callbackAttachBlob(error, data) {
  $('#modalBlob').modal('hide');
  if (error) {
    throwError("Cannot attach blob -> " + error);
    throw error;
  }
  console.log("Blob has been attached");
}

function callbackImportFile(error, data) {
  if (error) {
    throwError("Cannot import files -> " + error);
    throw error;
  }
  location.reload();
  console.log("Files has been imported");
}

function save() {
  var map = new Object();
  $("#docForm :input").each(function () {
    var name = $(this).attr('name');
    var input = $(this).val();
    map[name] = input;
  });
  RestAPI.updateDocument(map);
}

function callbackCurrentUser(error, user) {
  if (error) {
    throwError("Cannot get user -> " + error);
    throw error;
  }
  console.log(user);
  var template = $('#userId').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {userId: user.id});
  $('#targetUserId').html(rendered);
  template = $('#userInfos').html();
  Mustache.parse(template);
  rendered = Mustache.render(template, {user: user});
  $('#targetUserInfos').html(rendered);
}

function callbackRootChildren(error, children) {
  if (error) {
    throwError("Cannot fetch documents -> " + error);
    throw error;
  }
  console.log('Root document has ' + children.entries.length + ' children');
  var template = $('#children').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {children: children.entries});
  $('#targetChildren').html(rendered);
}

function callbackQuery(error, result) {
  if (error) {
    throwError("Cannot run query -> " + error);
    throw error;
  }
  console.log('Root document has ' + result.entries.length + ' children');
  var template = $('#children').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {children: result.entries});
  $('#targetChildren').html(rendered);
}

function callbackFetchDocument(error, doc) {
  if (error) {
    throwError("Cannot display document metadata -> " + error);
    throw error;
  }
  RestAPI.currentDocument = doc;
  if (doc.contextParameters.acls != undefined) {
    var ace = doc.contextParameters.acls[0].ace;
  }
  console.log('Selecting ' + doc.title);
  var template = $('#displayMetadata').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {doc: doc, ace: ace});
  $('#displayForm').html(rendered);
  template = $('#editionMetadata').html();
  Mustache.parse(template);
  rendered = Mustache.render(template, {doc: doc});
  $('#editionForm').html(rendered);
}

function callbackUpdateDocument(error, doc) {
  if (error) {
    throwError("Cannot display document metadata -> " + error);
    throw error;
  }
  RestAPI.currentDocument = doc;
  if (doc.contextParameters.acls != undefined) {
    var ace = doc.contextParameters.acls[0].ace;
  }
  console.log('Selecting ' + doc.title);
  var template = $('#displayMetadata').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {doc: doc, ace: ace});
  $('#displayForm').html(rendered);
  template = $('#editionMetadata').html();
  Mustache.parse(template);
  rendered = Mustache.render(template, {doc: doc});
  $('#editionForm').html(rendered);
  toggle();
}

// Show modal for error
function throwError(error) {
  $('#errorValue').append(error);
  $('#modalError').modal('show');
}

// Show modal confirm of deletion
function displayDelete() {
  $('#modalDelete').modal('show');
}

// Show modal for attaching blob
function displayBlob() {
  $('#modalBlob').modal('show');
}

// Toggle edit form
function toggle() {
  $('#editionForm').toggle();
  $('#displayForm').toggle();
}

$(document)
  .ready(function () {
    //Build Nuxeo Client
    RestAPI.client = RestAPI.config();

    // Call and display default domain children
    RestAPI.getRootChildren();

    // Call and display current user
    RestAPI.getCurrentUser();

    // Call query when clicking on search
    $('#search').click(function () {
      RestAPI.executeQuery($('#searchInput').val());
    });

    $('#importAction').click(function () {
      $('#modalImport').modal('show');
    });

    $('#importFiles').click(function () {
      console.log("Files size: " + $('#files')[0].files.length);
      importFiles($('#files')[0].files);
    });

    $('attachBlob').click(function () {
      $('#blobModal').modal('show');
    })

    $('#importBlob').click(function () {
      RestAPI.attachBlob($('#blob')[0].files[0]);
    });

    $('#refresh').click(function () {
      location.reload();
    });

    $('#deleteDoc').click(function () {
      RestAPI.deleteDocument();
    });

    $('#create').click(function () {
      $('#modalCreate').modal('show');
    });

    $('#createDoc').click(function () {
      var map = new Object();
      $("#createDocForm :input").each(function () {
        var name = $(this).attr('name');
        var input = $(this).val();
        map[name] = input;
      });
      RestAPI.createDocument(map);
    });

  }
)
;
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// DO NOT EDIT THE CODE ABOVE //////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////