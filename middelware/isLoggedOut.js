// TODO: Fix this

module.exports = (req, res, next) => {
    // if an already logged in user tries to access the login page it
    // redirects the user to /family/:id
    if (req.session.currentUser) {
      const familyId = 0// get id from session => find family id
      return res.redirect(`/family/${familyId}`);
    }
    next();
  };
  