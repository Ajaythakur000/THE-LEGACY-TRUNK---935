const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
    title: { // [cite: 89]
        type: String,
        required: true,
        trim: true,
    },
    description: { // [cite: 90]
        type: String,
        default: '',
    },
    // Har timeline ek user dwara banayi jaayegi.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FamilyMember'
    },
    // Ek timeline ke andar kai events ho sakte hain.
    // Hum yahan un sabhi events ki IDs ka ek array store karenge.
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
}, {
    timestamps: true
});

const Timeline = mongoose.model('Timeline', timelineSchema);

module.exports = Timeline;