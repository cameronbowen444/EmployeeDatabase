const Member = require('../models/member.model');

module.exports.index = (request, response) => {
    response.json({ message: "Your Member Practice"});
}

module.exports.getAllMembers = (request, response) => {
    Member.find({})
        .then(members => response.json(members))
        .catch(err => response.status(400).json({ err }))
}

module.exports.createMember = (request, response) => {
    Member.create(request.body)
        .then(createdMember => response.json(createdMember))
        .catch(err => response.status(400).json({ err }))
}

module.exports.getOneMember = (request, response) => {
    Member.findOne({ _id: request.params.id })
        .then(oneMember => response.json(oneMember))
        .catch(err => response.status(400).json({ err }))
}

module.exports.updateMember = (request, response) => {
    Member.findOneAndUpdate({ _id: request.params.id }, request.body, {new: true, runValidators: true})
        .then(updatedMember => response.json(updatedMember))
        .catch(err => response.status(400).json({ err }))
}

module.exports.deleteMember = (request, response) => {
    Member.deleteOne({ _id: request.params.id })
        .then(deletedMember => response.json(deletedMember))
        .catch(err => response.status(400).json({ err }))
}