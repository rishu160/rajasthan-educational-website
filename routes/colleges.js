const express = require('express');
const router = express.Router();

// Sample college data
let colleges = [
    {
        id: '1',
        name: 'Government College Jaipur',
        location: 'Jaipur',
        established: '1965',
        courses: ['Computer Science', 'Commerce', 'Science'],
        students: 2500,
        image: 'images/colleges/jaipur.jpg'
    },
    {
        id: '2',
        name: 'Rajasthan University College',
        location: 'Udaipur',
        established: '1970',
        courses: ['Agriculture Science', 'Commerce'],
        students: 1800,
        image: 'images/colleges/udaipur.jpg'
    }
];

// Get all colleges
router.get('/', (req, res) => {
    res.json({
        success: true,
        colleges: colleges
    });
});

// Get college by ID
router.get('/:id', (req, res) => {
    const college = colleges.find(c => c.id === req.params.id);
    if (!college) {
        return res.status(404).json({ error: 'College not found' });
    }
    res.json({
        success: true,
        college: college
    });
});

// Add new college (admin only)
router.post('/', (req, res) => {
    const { name, location, established, courses, students } = req.body;
    
    const newCollege = {
        id: Date.now().toString(),
        name,
        location,
        established,
        courses: courses || [],
        students: students || 0,
        image: 'images/colleges/default.jpg'
    };
    
    colleges.push(newCollege);
    
    res.status(201).json({
        success: true,
        message: 'College added successfully',
        college: newCollege
    });
});

module.exports = router;