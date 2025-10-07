const Timeline = require('../models/timelineModel.js');
const Event = require('../models/eventModel.js');
/**
 * @desc    Create a new timeline
 * @route   POST /api/timelines
 * @access  Private
 */
const createTimeline = async (req, res) => {
    try {
        // Request ki body se title aur description lena
        const { title, description } = req.body;

        // Title zaroori hai, isliye check karna
        if (!title) {
            return res.status(400).json({ message: 'Title is required for a timeline' });
        }

        // Nayi timeline banana aur use logged-in user se jodna
        const timeline = new Timeline({
            title,
            description: description || '',
            user: req.user._id // User ki ID 'protect' middleware se aa rahi hai
        });

        // Timeline ko database mein save karna
        const createdTimeline = await timeline.save();
        res.status(201).json(createdTimeline);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

/**
 * @desc    Get all timelines for the logged-in user
 * @route   GET /api/timelines
 * @access  Private
 */
const getMyTimelines = async (req, res) => {
    try {
        // Sirf uss user ki timelines dhoondhna jo logged-in hai
        const timelines = await Timeline.find({ user: req.user._id });
        res.json(timelines);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};
/**
 * @desc    Get a single timeline by ID with all its events
 * @route   GET /api/timelines/:id
 * @access  Private
 */
const getTimelineById = async (req, res) => {
    try {
        // Timeline ko ID se dhoondo aur .populate('events') ka use karke
        // uske saare events ki details bhi saath mein fetch karo.
        const timeline = await Timeline.findById(req.params.id).populate('events');

        if (!timeline) {
            return res.status(404).json({ message: 'Timeline not found' });
        }

        // Security Check: Kya yeh timeline isi user ki hai?
        if (timeline.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        res.json(timeline);

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};



/**
 * @desc    Add a new event to a timeline
 * @route   POST /api/timelines/:id/events
 * @access  Private
 */
const addEventToTimeline = async (req, res) => {
    try {
        const timelineId = req.params.id;
        const { eventName, eventDate, description } = req.body;

        // 1. Pehle timeline ko dhoondho
        const timeline = await Timeline.findById(timelineId);

        if (!timeline) {
            return res.status(404).json({ message: 'Timeline not found' });
        }

        // 2. Security Check: Kya yeh timeline isi user ki hai?
        if (timeline.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        
        // 3. Naya event create karo
        const event = new Event({
            eventName, //
            eventDate, //
            description, //
            timeline: timelineId // Event ko parent timeline se link karo
        });

        const createdEvent = await event.save();

        // 4. Naye event ki ID ko timeline ke 'events' array mein add karo
        timeline.events.push(createdEvent._id);
        await timeline.save();

        // 5. Naya create hua event response mein bhejo
        res.status(201).json(createdEvent);

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


/**
 * @desc    Remove an event from a timeline
 * @route   DELETE /api/timelines/:timelineId/events/:eventId
 * @access  Private
 */
const removeEventFromTimeline = async (req, res) => {
    try {
        const { timelineId, eventId } = req.params;

        // 1. Pehle timeline ko dhoondho
        const timeline = await Timeline.findById(timelineId);

        if (!timeline) {
            return res.status(404).json({ message: 'Timeline not found' });
        }

        // 2. Security Check: Kya yeh timeline isi user ki hai?
        if (timeline.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // 3. Event ko database se delete karo
        const event = await Event.findByIdAndDelete(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // 4. Timeline ke 'events' array se uss event ki ID ko hatao
        timeline.events.pull(eventId);
        await timeline.save();

        res.json({ message: 'Event removed successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


module.exports = { 
    createTimeline, 
    getMyTimelines, 
    getTimelineById, 
    addEventToTimeline, 
    removeEventFromTimeline // Naya function export kiya
};