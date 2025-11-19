// controllers/studentController.js
const Student = require('../models/studentModel');
const logger = require('../config/logger');
const escapeHtml = require('escape-html');

//All functions for export contain try-catch for error handling and logging
//Utilising this pattern to ensure robust error management and secure logging

//All these functions are exported for use in routes

//Exports the function for listing students
exports.list = async (req, res) => {
  try {
    const students = await Student.getAll();
    res.render('students', { title: 'Students', students });
  } catch (err) {
    //Log unexpected error fetching students
    logger.error('Get students failed', { error: err.message });
    res.status(500).send(`Could not fetch students: ${err.message}`);
  }
};

//Exports the function to show the create student form
exports.showCreate = (req, res) => {
  res.render('student_form', { title: 'Add Student', student: {} });
};

//Exports the function to create a new student
exports.create = async (req, res) => {
  try {
    const { name, course } = req.body;
    //Checik for required name field
    if (!name || name.trim().length === 0) return res.status(400).send('Name required');
    //Create the student record, trimming whitespace
    await Student.create(name.trim(), course ? course.trim() : null);
    //Log student creation event
    logger.info('Student created', { name });
    res.redirect('/students');
  } catch (err) {
    //Log unexpected student creation error
    logger.error('Create student failed', { error: err.message });
    res.status(500).send('Could not create student');
  }
};

//Exports the function to show the edit student form
exports.showEdit = async (req, res) => {
  try {
    const student = await Student.getById(req.params.id);
    //Check if student exists
    if (!student) return res.status(404).send('Not found');
    res.render('student_form', { title: 'Edit Student', student });
  } catch (err) {
    //Log unexpected error fetching student
    logger.error('Get student failed', { error: err.message });
    res.status(500).send('Could not fetch student');
  }
};

//Exports the function to update a student
exports.update = async (req, res) => {
  try {
    const { name, course } = req.body;
    //Check for required name field and trim whitespace
    if (!name || name.trim().length === 0) return res.status(400).send('Name required');
    await Student.update(req.params.id, name.trim(), course ? course.trim() : null);
    //Log student update event
    logger.info('Student updated', { id: req.params.id, name });
    res.redirect('/students');
  } catch (err) {
    //Log unexpected student update error
    logger.error('Update student failed', { error: err.message });
    res.status(500).send('Could not update student');
  }
};

//Exports the function to delete a student
exports.remove = async (req, res) => {
  try {
    await Student.remove(req.params.id);
    //Log student removal event
    logger.info('Student removed', { id: req.params.id });
    res.redirect('/students');
  } catch (err) {
    //Log unexpected student removal error
    logger.error('Delete student failed', { error: err.message });
    res.status(500).send('Could not delete student');
  }
};

//Exports Insecure reflected XSS student search function
exports.searchStudents = (req, res) => {
  const term = req.query.q;

  //Reflected XSS vulnerability: user input is directly included in the response without escaping
  //The html is constructed using template literals, whic does not sanitize input
  res.send(`
    <h2>Search Results</h2>
    <p>You searched for: ${term}</p>
    <a href="/students">Back</a>
  `);
};

