handleError = function(res, err) {
    if (err.code === 11000) {
        var errmsg = 'Email Address is taken';
    }
    var error = {
        code : err.code,
        message : errmsg
    }
    res.send(error);
}

module.exports = handleError