const calculateAgeFromBirthdate = (birthdate) => {
  const today = new Date();
  let age = Math.floor((today - new Date(birthdate)) / 1000 / 60 / 60 / 24 / 365);
  return age;
}

const calculateEarliestBirthyear = (familyMembers) => {
  const membersSortedByBirthyear = familyMembers.sort((next, current) => {
    return new Date(current.dateOfBirth).getUTCFullYear() - new Date(next.dateOfBirth).getUTCFullYear();
  });
  return new Date(membersSortedByBirthyear[0].dateOfBirth).getUTCFullYear();
}


module.exports = {
  calculateAgeFromBirthdate,
  calculateEarliestBirthyear
}