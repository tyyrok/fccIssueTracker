'use strict';
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let issueSchema = new mongoose.Schema({
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
      console.log(project);
      
      Issue.find({})
           .then( (all) => {
             res.json(all);
           })
           .catch( (err) => {
             console.log(err);
           });
      
    })
    
    .post(function (req, res){
      let project = req.body;
      console.log(project, req.params.project);
      let newIssue = new Issue ({ issue_title: project.issue_title,
                                  issue_text: project.issue_text,
                                  created_by: project.created_by,
                                  assigned_to: project.assigned_to,
                                  status_text: project.status_text,
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
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
