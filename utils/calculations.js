const calculateAgeFromBirthdate = (birthdate, referenceDate) => {
  if (!referenceDate) {
    referenceDate = new Date();
  }

  const millisecondToYearConversion = 1000 * 60 * 60 * 24 * 365;
  let age = Math.floor((referenceDate ?? new Date() - new Date(birthdate)) / millisecondToYearConversion);
  return age;
}

const calculateEarliestBirthyear = (familyMembers) => {
  const membersSortedByBirthyear = familyMembers.sort((next, current) => {
    return new Date(next.dateOfBirth).getUTCFullYear() - new Date(current.dateOfBirth).getUTCFullYear();
  });
  return new Date(membersSortedByBirthyear[0].dateOfBirth).getUTCFullYear();
}

const convertToReadableDate = (date) => {
  const birthDay = String(date.getDay()).padStart(2, "0");
  const birthMonth = String(date.getMonth() + 1).padStart(2, "0");
  const birthYear = date.getFullYear();
  return `${birthDay}.${birthMonth}.${birthYear}`;
}


module.exports = {
  calculateAgeFromBirthdate,
  calculateEarliestBirthyear,
  convertToReadableDate
}