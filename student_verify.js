const student_verify = (req, res, next) => {
    if (req.session.username&&req.session.category=="student") {
        next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        res.send("<script>alert('Only verified college students can create new Posts, kindly login as a Student'); window.location.href='/login';</script>");
    }
}
module.exports = student_verify;