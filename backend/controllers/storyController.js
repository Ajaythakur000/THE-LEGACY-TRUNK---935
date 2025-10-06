const Story = require('../models/storyModel.js'); // Sahi path aur filename

/**
 * @desc    Create a new story
 * @route   POST /api/stories
 * @access  Private
 */
const createStory = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        let mediaUrl = '';
        let mediaType = 'text';

        if (req.file) {
            mediaUrl = req.file.path;
            if (req.file.mimetype.startsWith('image')) mediaType = 'photo';
            if (req.file.mimetype.startsWith('video')) mediaType = 'video';
            if (req.file.mimetype.startsWith('audio')) mediaType = 'audio';
        }

        const story = new Story({
            title,
            content,
            tags: tags ? tags.split(',') : [],
            user: req.user._id,
            mediaUrl,
            mediaType,
        });

        const createdStory = await story.save();
        res.status(201).json(createdStory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

/**
 * @desc    Get stories for a logged-in user
 * @route   GET /api/stories
 * @access  Private
 */
const getMyStories = async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user._id });
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

/**
 * @desc    Get a single story by ID
 * @route   GET /api/stories/:id
 * @access  Private
 */
const getStoryById = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);

        if (story) {
            if (story.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }
            res.json(story);
        } else {
            res.status(404).json({ message: 'Story not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

/**
 * @desc    Update a story
 * @route   PUT /api/stories/:id
 * @access  Private
 */
const updateStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        if (story.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        story.title = req.body.title || story.title;
        story.content = req.body.content || story.content;
        story.tags = req.body.tags ? req.body.tags.split(',') : story.tags;

        const updatedStory = await story.save();
        res.json(updatedStory);

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

/**
 * @desc    Delete a story
 * @route   DELETE /api/stories/:id
 * @access  Private
 */
const deleteStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);

        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }

        if (story.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Story.deleteOne({ _id: req.params.id });

        res.json({ message: 'Story removed successfully', id: req.params.id });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// Sabhi functions ko export karna
module.exports = { createStory, getMyStories, getStoryById, updateStory, deleteStory };