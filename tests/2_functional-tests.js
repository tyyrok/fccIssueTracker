const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);
  test('#1 Create an issue with every field: POST request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({ "issue_title": "Fix error in posting data",
                "issue_text": "When we post data it has an error.",
                "created_on": "2017-01-08T06:35:14.240Z",
                "updated_on": "2017-01-08T06:35:14.240Z",
                "created_by": "Joe",  })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.issue_title, "Fix error in posting data");
          done();
        })
  });
  test('#2 Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({ "issue_title": "2 Fix error in posting data",
                "issue_text": "When we post data it has an error.",
                "created_on": "",
                "updated_on": "",
                "created_by": "Joe",  })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.issue_title, "2 Fix error in posting data");
          done();
        })
  });
  test('#3 Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({ "issue_title": "2 Fix error in posting data",
                "issue_text": "",
                "created_on": "",
                "updated_on": "",
                "created_by": "",  })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        })
  });
  test('#4 View issues on a project: GET request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .get('/api/issues/apitest')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          done();
        })
  });
  test('#5 View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .get('/api/issues/apitest?open=true')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          done();
        })
  });
  test('#6 View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .get('/api/issues/apitest?open=true&created_by=Jaw')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          done();
        })
  });
  test('#7 Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .put('/api/issues/apitest')
        .send({
          "_id": "645e8d4c4f3996558f76d557",
          "issue_title": "Update title: Fix error in posting data",
          "issue_text": "Nothing special, just update",
          "created_on": "",
          "updated_on": "",
          "created_by": "Max",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.result, 'successfully updated');
          done();
        })
  });
  test('#8 Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .put('/api/issues/apitest')
        .send({
          "_id": "645e8d4c4f3996558f76d557",
          "issue_title": "Update title 2: Fix error in posting data",
          "issue_text": "Nothing special, just another update",
          "created_on": "",
          "updated_on": "",
          "created_by": "Max",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.include(res.body, { _id: "645e8d4c4f3996558f76d557" });
          done();
        })
  });
  test('#9 Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .put('/api/issues/apitest')
        .send({
          "issue_title": "Update title 2: Fix error in posting data",
          "issue_text": "Nothing special, just another update",
          "created_on": "",
          "updated_on": "",
          "created_by": "Max",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.include(res.body, { error: 'missing _id' });
          done();
        })
  });
  test('#10 Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .put('/api/issues/apitest')
        .send({
          "_id": "645e8d4c4f3996558f76d557",
          "issue_title": "",
          "issue_text": "",
          "created_on": "",
          "updated_on": "",
          "created_by": "",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.include(res.body, { error: 'no update field(s) sent', '_id': "645e8d4c4f3996558f76d557" });
          done();
        })
  });
  test('#11 Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .put('/api/issues/apitest')
        .send({
          "_id": "645e8d4c996558f76d557",
          "issue_title": "Update title 2: Fix error in posting data",
          "issue_text": "Nothing special, just another update",
          "created_on": "",
          "updated_on": "",
          "created_by": "Max",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.include(res.body, { error: 'could not update', '_id': '645e8d4c996558f76d557' });
          done();
        })
  });
  test('#12 Delete an issue: DELETE request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .delete('/api/issues/apitest')
        .send({
          "_id": "645e8b483c7bfb6e005f2dd2",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.include(res.body, { result: 'successfully deleted', '_id': "645e8b483c7bfb6e005f2dd2" });
          done();
        })
  });
  test('#13 Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .delete('/api/issues/apitest')
        .send({
          "_id": "6",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.include(res.body, { error: 'could not delete', '_id': '6' });
          done();
        })
  });
  test('#14 Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
    chai.request(server)
        .keepOpen()
        .delete('/api/issues/apitest')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.include(res.body, { error: 'missing _id' });
          done();
        })
  });
});
