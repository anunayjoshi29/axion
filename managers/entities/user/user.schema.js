

module.exports = {
    createUser: [
        {
            model: 'username',
            required: true,
        },
        {
            model: 'password',
            required: true,
        },
        {
            model: 'email',
            required: true,
        },
    ],
    updateUserAccessControl: [
        {
            model: 'accessControl',
            required: true,
        },
    ],
}


