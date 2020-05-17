const fs = require("fs");
const {
  default: fetchPackageJson,
  VersionNotFoundError,
  PackageNotFoundError,
} = require("package-json");

const path = require("path");
const { updateRc } = require("./version");

const directoryPath = path.join(__dirname, "../..", "packages");

function getPackages(dir) {
  const files = fs.readdirSync(dir);

  const paths = [];
  const packages = [];
  files
    .filter((file) => fs.statSync(`${dir}/${file}`).isDirectory())
    .forEach((file) => {
      const localDir = `${dir}/${file}`;

      const package = fs.readdirSync(localDir);

      paths.push(localDir);
      packages.push(package);
    });

  return { packages, paths };
}

const { packages, paths } = getPackages(directoryPath);

const regEXP = /package.json/;
const packageJsons = packages
  .flatMap((x) => x)
  .filter((file) => regEXP.test(file));

const packagesJsonData = packageJsons.map((file, i) =>
  fs.readFileSync(`${paths[i]}/${file}`, { encoding: "utf8" })
);

const parsedPackagesJsonData = packagesJsonData.map((data) => JSON.parse(data));

function startReleaseCandidate(data, pathToPck) {
  const newVersion = updateRc(data.version);

  if (newVersion) {
    const newPackageJson = { ...data, version: newVersion };

    fs.writeFileSync(
      `${pathToPck}/package.json`,
      JSON.stringify(newPackageJson, null, "\t"),
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

process.on("uncaughtException", (err) => {
  console.error(
    `${new Date().toUTCString()} uncaught exception: ${err.message}`
  );

  console.error(err);
  process.exit(1);
});
