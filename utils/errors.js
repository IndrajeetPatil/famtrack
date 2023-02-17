const errors = {
  duplicateUsername: {
    errorMessage: "Username already exists. Please provide a different username.",
  },
  duplicateEmail: {
    errorMessage: "Email already exists. Please provide a different email.",
  },
  birthInFuture: {
    errorMessage: "The birthdate you provided lies in the future. Please enter a date in the past.",
  },
  deathBeforeBirth: {
    errorMessage: "The death date you provided lies before the birthdate. Please enter a valid death date.",
  },
  invalidBirthdate: {
    errorMessage: "The birthdate you provided is invalid. Please enter a different birthdate.",
  },
  termsNotAccepted: {
    errorMessage: "You must accept the terms and conditions to sign up.",
  },
  weakPassword: {
    errorMessage: "Password needs to have at least 6 characters, one number, one lowercase, and one uppercase letter.",
  },
  mandatorySignupFieldsMissing: {
    errorMessage: "All fields are mandatory. Please provide your username, email, and password.",
  },
  mandatoryLoginFieldsMissing: {
    errorMessage: "All fields are mandatory. Please provide your username and password.",
  },
  userNotFound: {
    errorMessage: "Username not found. Either provide a valid username or sign up for an account.",
  },
  wrongPassword: {
    errorMessage: "Incorrect password. Please try again.",
  },
};

const signalBadInput = (res, view, error) => res.status(400).render(view, { error, hideLogout: true } );

module.exports = { errors, signalBadInput };
