const fs = require("fs");
const {
  default: fetchPackageJson,
  VersionNotFoundError,
  PackageNotFoundError
} = require("package-json");
const { getPackages, getPackageJsonDataFromPackages } = require("./packages");
const path = require("path");
const { updateRc } = require("./version");

const directoryPath = path.join(__dirname, "../..", "packages");

const { packages, paths } = getPackages(directoryPath);

const parsedPackagesJsonData = getPackageJsonDataFromPackages(packages, paths);

function startReleaseCandidate(data, pathToPck) {
  const newVersion = updateRc(data.version);

  if (newVersion) {
    const newPackageJson = { ...data, version: newVersion };

    fs.writeFileSync(
      `${pathToPck}/package.json`,
      JSON.stringify(newPackageJson, null, 2),
      "utf8"
    );
  } else {
    console.log("can't update version of package");
    throw new Error("can't update version of package");
  }
}

parsedPackagesJsonData.forEach(async (data, i) => {
  const { version, name } = data;
  const pathToPck = paths[i];
  try {
    // await fetchPackageJson(name, { version });
    startReleaseCandidate(data, pathToPck);
  } catch (err) {
    if (err instanceof PackageNotFoundError) {
      console.log("need to publish the package", name);
    } else if (err instanceof VersionNotFoundError) {
      startReleaseCandidate(data, pathToPck);
    } else {
      console.log("Unhandled error", name, version, err);
    }
  }
});

process.on("uncaughtException", err => {
  console.error(
    `${new Date().toUTCString()} uncaught exception: ${err.message}`
  );

  console.error(err);
  process.exit(1);
});
