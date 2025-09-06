const express = require('express');
const router = express.Router();

// Sample live classes data
let liveClasses = [];

// Get all live classes
router.get('/', (req, res) => {
    res.json({
        success: true,
        classes: liveClasses
    });
});

// Create new live class
router.post('/create', (req, res) => {
    const { title, subject, date, time, duration, meetLink, teacherId } = req.body;
    
    const newClass = {
        id: Date.now().toString(),
        title,
        subject,
        date,
        time,
        duration: duration || 60,
        meetLink,
        teacherId,
        students: [],
        status: 'scheduled',
        createdAt: new Date()
    };
    
    liveClasses.push(newClass);
    
    res.status(201).json({
        success: true,
        message: 'Live class created successfully',
        class: newClass
    });
});

// Join live class
router.post('/:id/join', (req, res) => {
    const { userId } = req.body;
    const classId = req.params.id;
    
    const liveClass = liveClasses.find(c => c.id === classId);
    if (!liveClass) {
        return res.status(404).json({ error: 'Class not found' });
    }
    
    // Add student to class if not already joined
    if (!liveClass.students.includes(userId)) {
        liveClass.students.push(userId);
    }
    
    res.json({
        success: true,
        message: 'Joined class successfully',
        meetLink: liveClass.meetLink
    });
});

module.exports = router;