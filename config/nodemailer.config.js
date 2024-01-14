module.exports = {
    host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass
    }
};

