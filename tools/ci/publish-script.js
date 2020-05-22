const fs = require("fs");
const {
  default: fetchPackageJson,
  VersionNotFoundError,
  PackageNotFoundError
} = require("package-json");
const cp = require("child_process");
const { getPackages, getPackageJsonDataFromPackages } = require("./packages");
const path = require("path");
const Graph = require("./graph");
const { updatePackagesVersions } = require("./version");

const directoryPath = path.join(__dirname, "../..", "packages");

const { packages, paths } = getPackages(directoryPath);

const parsedPackagesJsonData = getPackageJsonDataFromPackages(packages, paths);

function writeDataToDisk(updatedPackagesData, packagesToUpdatePaths) {
  updatedPackagesData.map((updatedPackageData, i) => {
    try {
      fs.writeFileSync(
        `${packagesToUpdatePaths[i]}/package.json`,
        JSON.stringify(updatedPackageData, null, 2),
        "utf8"
      );
    } catch (err) {
      console.log("can't update version of package");
      console.log(err);
      throw new Error("can't update version of package");
    }
  });
}

const packagesToUpdate = [];

parsedPackagesJsonData.forEach(async (packageData, i) => {
  const { version, name } = packageData;
  const pathToPck = paths[i];
  try {
    await fetchPackageJson(name, { version });
    // packagesToUpdate.push({ packageData, pathToPck });
  } catch (err) {
    if (err instanceof PackageNotFoundError) {
      console.log("need to publish the package", name);
      packagesToUpdate.push({ packageData, pathToPck });
    } else if (err instanceof VersionNotFoundError) {
      packagesToUpdate.push({ packageData, pathToPck });
    } else {
      console.log("Unhandled error", name, version, err);
      process.exit(1);
    }
  }
});

function publishNpm(cwd) {
  try {
    cp.execSync("npm publish", {
      cwd: cwd,
      env: process.env
    });
  } catch (err) {
    console.log("publishNpm err", err.stdout.toString("utf8"));
    process.exit(1);
  }
}

try {
  const packagesToUpdateData = packagesToUpdate.map(
    ({ packageData }) => packageData
  );

  const packagesToUpdatePaths = packagesToUpdate.map(
    ({ pathToPck }) => pathToPck
  );

  const updatedPackagesData = updatePackagesVersions(packagesToUpdateData);

  writeDataToDisk(updatedPackagesData, packagesToUpdatePaths);

  const priorityQueue = Graph.createGraphFromPackages(
    updatedPackagesData
  ).topologicalSort();

  priorityQueue.forEach(packageIndex => {
    publishNpm(packagesToUpdatePaths[packageIndex]);
  });
} catch (error) {
  console.log("updatePackagesVersions", "problem", error);
  process.exit(1);
}

process.on("uncaughtException", err => {
  console.error(
    `${new Date().toUTCString()} uncaught exception: ${err.message}`
  );

  console.error(err);
  process.exit(1);
});
