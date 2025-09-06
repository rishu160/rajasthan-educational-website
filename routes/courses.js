const express = require('express');
const router = express.Router();

// Sample course data
let courses = [
    {
        id: '1',
        name: 'Computer Science',
        duration: '3 Years',
        degree: 'B.Sc Computer Science',
        description: 'Programming, Software Development, Database Management',
        colleges: ['1', '2'],
        subjects: ['Programming', 'Data Structures', 'Database', 'Web Development']
    },
    {
        id: '2',
        name: 'Commerce',
        duration: '3 Years',
        degree: 'B.Com/BBA',
        description: 'Accounting, Business Studies, Economics, Banking',
        colleges: ['1', '2'],
        subjects: ['Accounting', 'Business Studies', 'Economics', 'Banking']
    }
];

// Get all courses
router.get('/', (req, res) => {
    res.json({
        success: true,
        courses: courses
    });
});

// Get course by ID
router.get('/:id', (req, res) => {
    const course = courses.find(c => c.id === req.params.id);
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    res.json({
        success: true,
        course: course
    });
});

// Enroll in course
router.post('/:id/enroll', (req, res) => {
    const { userId } = req.body;
    const courseId = req.params.id;
    
    // Here you would typically save enrollment to database
    res.json({
        success: true,
        message: 'Successfully enrolled in course',
        courseId: courseId,
        userId: userId
    });
});

module.exports = router;