module.exports = (app) => {
  // this middleware runs whenever requested page is not available
  app.use((req, res, next) => res.status(404).render("not-found"));

  // when calling next(err), this middleware will handle the error
  app.use((err, req, res, next) => {
    console.error("ERROR", req.method, req.path, err);

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      res.status(500).render("error");
    }
  });
};
