const faculty_verify = (req, res, next) => {
    if (req.session.username&&req.session.category=="faculty") {
        next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        res.send("<script>alert('Only Faculty can answer a question, kindly login as Faculty'); window.location.href='/login';</script>");
    }
};
module.exports = faculty_verify;