// controllers/studentController.js
const Student = require('../models/studentModel');
const logger = require('../config/logger');
const escapeHtml = require('escape-html');

exports.list = async (req, res) => {
  try {
    const students = await Student.getAll();
    res.render('students', { title: 'Students', students });
  } catch (err) {
    logger.error('Get students failed', { error: err.message });
    res.status(500).send(`Could not fetch students: ${err.message}`);
  }
};

exports.showCreate = (req, res) => {
  res.render('student_form', { title: 'Add Student', student: {} });
};

exports.create = async (req, res) => {
  try {
    const { name, course } = req.body;
    if (!name || name.trim().length === 0) return res.status(400).send('Name required');

    await Student.create(name.trim(), course ? course.trim() : null);
    logger.info('Student created', { name });
    res.redirect('/students');
  } catch (err) {
    logger.error('Create student failed', { error: err.message });
    res.status(500).send('Could not create student');
  }
};

exports.showEdit = async (req, res) => {
  try {
    const student = await Student.getById(req.params.id);
    if (!student) return res.status(404).send('Not found');
    res.render('student_form', { title: 'Edit Student', student });
  } catch (err) {
    logger.error('Get student failed', { error: err.message });
    res.status(500).send('Could not fetch student');
  }
};

exports.update = async (req, res) => {
  try {
    const { name, course } = req.body;
    if (!name || name.trim().length === 0) return res.status(400).send('Name required');
    await Student.update(req.params.id, name.trim(), course ? course.trim() : null);
    logger.info('Student updated', { id: req.params.id, name });
    res.redirect('/students');
  } catch (err) {
    logger.error('Update student failed', { error: err.message });
    res.status(500).send('Could not update student');
  }
};

exports.remove = async (req, res) => {
  try {
    await Student.remove(req.params.id);
    logger.info('Student removed', { id: req.params.id });
    res.redirect('/students');
  } catch (err) {
    logger.error('Delete student failed', { error: err.message });
    res.status(500).send('Could not delete student');
  }
};
