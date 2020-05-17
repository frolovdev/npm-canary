const fs = require("fs");
const {
  default: fetchPackageJson,
  VersionNotFoundError,
  PackageNotFoundError,
} = require("package-json");
const cp = require("child_process");
const path = require("path");

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

async function startRelease(name, version, pathToPck) {
  cp.execFile(
    "npm",
    ["version", "prerelease", "--preid=rc"],
    { cwd: pathToPck, env: process.env },
    (err, stdout, stderr) => {
      if (err) {
        console.log("err", err);
      } else {
        console.log("stderr", stderr);
        console.log("stdout", stdout);
      }
    }
  );
}

parsedPackagesJsonData.forEach(async (data, i) => {
  const { version, name } = data;
  const pathToPck = paths[i];
  try {
    const package = await fetchPackageJson(name, { version });
  } catch (err) {
    if (err instanceof PackageNotFoundError) {
      console.log("maybe need to publish the package", name);
      console.log("PackageNotFoundError", name, version, err);
    } else if (err instanceof VersionNotFoundError) {
      await startRelease(name, version, pathToPck);
    } else {
      console.log("Unhandled error", name, version, err);
    }
  }
});
