'use strict';
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let issueSchema = new mongoose.Schema({
  project : {
    type:String,
    required: true,
  },
  issue_title: {
    type: String,
    required: true,
  }, 
  issue_text: {
    type: String,
    required: true,
  },
  created_on: Date,
  updated_on: Date,
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: String,
  open: Boolean,
  status_text: String,
});
let Issue = new mongoose.model('Issue', issueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;

      let objectToFind = {
        project: project,
      };
      console.log(project);
      for (let param in req.query) {
        objectToFind[`${param}`] = req.query[`${param}`]; 
      }
      console.log(objectToFind);
      Issue.find(objectToFind)
           .select("-project -__v")
           .then( (all) => {
             res.json(all);
           })
           .catch( (err) => {
             console.log(err);
           });
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let issue = req.body;

      if (!issue.issue_title || !issue.issue_text || !issue.created_by ){
        res.json({ error: 'required field(s) missing'});
      } else {
      
        let newIssue = new Issue ({ project: project,
                                    issue_title: issue.issue_title,
                                    issue_text: issue.issue_text,
                                    created_by: issue.created_by,
                                    assigned_to: issue.assigned_to ?? '',
                                    status_text: issue.status_text ?? '',
                                    created_on: new Date(),
                                    updated_on: new Date(),
                                    open: true,
                                  });
        newIssue.save()
                .then( (addedIssue) => {
                  res.json({
                    _id: addedIssue._id,
                    issue_title: addedIssue.issue_title,
                    issue_text: addedIssue.issue_text,
                    created_on: addedIssue.created_on,
                    updated_on: addedIssue.updated_on,
                    created_by: addedIssue.created_by,
                    assigned_to: addedIssue.assigned_to,
                    open: addedIssue.open,
                    status_text: addedIssue.status_text,
                  });
                })
                .catch( (err) => {
                  console.log(err);
                });
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
      if (!req.body._id) {
        res.json({ error: 'missing _id' });
      } else if (Object.values(req.body).join('') == req.body._id) {
        res.json({ error: 'no update field(s) sent', '_id': req.body._id });
      } else {
        
        Issue.findById({ _id: req.body._id })
             .then( (issue) => {
                for (let param in req.body) {
                  if (req.body[`${param}`] != '') {
                    issue[`${param}`] = req.body[`${param}`]; 
                  }
                }
               issue.updated_on = new Date();
               issue.save()
                    .then( (updatedIssue) => {
                      res.json({ result: 'successfully updated', '_id': updatedIssue._id });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
             })
             .catch( (err) => {
               console.log("Err while updating - " + err);
               res.json({ error: 'could not update', '_id': req.body._id });
             });
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;

      if (!req.body._id) {
        res.json({ error: 'missing _id' });
      } else {
        
        Issue.findOneAndRemove({ _id: req.body._id })
             .then( (removedIssue) => {
               res.json({ result: 'successfully deleted', '_id': removedIssue._id });
             })
             .catch( (err) => {
               console.log("Err while deleting - " + err);
               res.json({ error: 'could not delete', '_id': req.body._id                        });
             });
      }
    });
    
};
