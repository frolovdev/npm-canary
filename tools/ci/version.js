function checkIsRc(version) {
  const isRc = /[0-9]-rc.\d+/.test(version);

  debugger;
  return isRc;
}

function updateRc(version) {
  if (checkIsRc(version)) {
    const prefix = "-rc.";
    const resultStringIndex = version.indexOf(prefix);

    const oldVersion = Number(version.slice(resultStringIndex + 4));
    const newVersion = oldVersion + 1;

    const newVersionString = `${version.slice(
      0,
      resultStringIndex
    )}${prefix}${newVersion}`;

    return newVersionString;
  } else {
    return `${version}-rc.0`;
  }
}

module.exports = {
  updateRc,
};
