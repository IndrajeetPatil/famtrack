const calculateAgeFromBirthdate = (birthdate) => {
  const today = new Date();
  const millisecondToYearConversion = 1000 * 60 * 60 * 24 * 365;
  let age = Math.floor((today - new Date(birthdate)) / millisecondToYearConversion);
  return age;
}

const calculateEarliestBirthyear = (familyMembers) => {
  const membersSortedByBirthyear = familyMembers.sort((next, current) => {
    return new Date(current.dateOfBirth).getUTCFullYear() - new Date(next.dateOfBirth).getUTCFullYear();
  });
  return new Date(membersSortedByBirthyear[0].dateOfBirth).getUTCFullYear();
}

const convertToReadableDate = (date, delimiter) => {
  const birthDay = String(date.getDay()).padStart(2, "0");
  const birthMonth = String(date.getMonth() + 1).padStart(2, "0");
  const birthYear = date.getFullYear();
  return `${birthDay}${delimiter}${birthMonth}${delimiter}${birthYear}`;
}

function filterMembers(memberArray, selectedArray) {
  return memberArray.filter(val => !selectedArray.includes(val));
}




module.exports = {
  calculateAgeFromBirthdate,
  calculateEarliestBirthyear,
  convertToReadableDate,
  filterMembers
}