<p align="center">
  <a href="https://github.com/search?o=desc&q=dangoslen%2Fchangelog-enforcer+path%3A.github%2Fworkflows+language%3AYAML&s=&type=Code" target="_blank" title="Public workflows that use this action.">
    <img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fapi-git-master.endbug.vercel.app%2Fapi%2Fgithub-actions%2Fused-by%3Faction%3Ddangoslen%2Fchangelog-enforcer%26badge%3Dtrue" alt="Public workflows that use this action.">
  </a>
  <img src="https://github.com/dangoslen/changelog-enforcer/workflows/units-test/badge.svg?branch=master" alt="unit tests badge" />
  <img src="https://img.shields.io/github/v/release/dangoslen/changelog-enforcer?color=orange&label=Latest" alt="latest version" />
  <img src="./coverage/badge.svg" alt="coverage badge" />
 </p>

## Changelog Enforcer
The purpose of this action is to enforce a change to a ongoing changelog file. Inspired by [Keep A Changelog](https://keepachangelog.com/en/1.0.0/), this action helps development teams to keep a change file up to date as new features or fixes are implemented. 

### Usage
To use, follow the typical GitHub Action `uses` syntax. 

**Requires the common [Checkout Action](https://github.com/marketplace/actions/checkout) as shown below! The enforcement of change is done all using local `git` commands and requires the repository be checked out!**

```yaml
name: "Pull Request Workflow"
on:
  pull_request:
      types: [opened, synchronize, reopened, ready_for_review, labeled, unlabeled]

jobs:
  # Enforces the update of a changelog file on every pull request 
  changelog:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: dangoslen/changelog-enforcer@v2
      with:
        changeLogPath: 'CHANGELOG.md'
        skipLabels: 'Skip-Changelog'
```

### Inputs / Properties
Below are the properties allowed by the Changelog Enforcer. These properties are shipped with sane defaults for typical use, especially for changelogs inline with the [KeepAChangelog](Keepachangelog.org) format.

#### `changeLogPath`
* Default: `CHANGELOG.md`
* The path to your changelog file. Should be from the perspective of the root directory to `git`. The file being checked for updates must be either an add (`A`) or modified (`M`) status to `git` to qualify as updated. 

#### `skipLabels` 
* Default: `'Skip-Changelog'` 
* List of labels used to skip enforcing of the changelog during a pull request. Each label name is comma seperated and only one label needs to be present for enforcement to be skipped. 

  For example, if `label-1,label-2` was supplied as the `skipLabels`, `label-1` _or_ `label-2` would skip the enforcer. Each label is trimmed for leading and trailing spaces since GitHub labels do not allow for leading or trailing spaces. Thus, the following lists are equivalent:
  * `label-1,label-2`
  * `label-1 , label-2`
  * `label-1  ,label-2`

#### `missingUpdateErrorMessage`
* Default: `''`
* Custom error message to use when no update to the changelog is found.

#### `expectedLatestVersion`
* Default: `''`
* The latest version of the software expected in the changelog. Should be in the form of `v1.1.0`, `v3.5.6` etc.

#### `versionPattern`
* Default: `'## \\[((v|V)?\\d*\\.\\d*\\.\\d*-?\\w*|unreleased|Unreleased|UNRELEASED)\\]'`
* A regex pattern used to extract the versions from the changelog. Changelog Enforcer assumes the use of the KeepAChangelog.com convention, and as such looks for a line starting with `## [version] - date`. Your regex should match the version as the 2nd match group. The regex pattern is used with global and multiline flags. Also note that since this is passed as a String, you will need to escape a backslash `\` character via `\\`

### Outputs

#### `errorMessage`
* The reason for why the Changelog Enforcer failed. Uses the `missingUpdateErrorMessage` property value if set when no update to the changelog is found.

### Creating Releases Automatically
Using this Action and the [Changelog Reader](https://github.com/mindsers/changelog-reader-action), plus a few standard GitHub created Actions, we can keep the changelog of a project up to date and create a GitHub release automatically with contents from the changelog. See this project's [release.yml](./.github/workflows/release.yml) for how to set up a simple workflow to create a new release based on a `VERSION` file and a changelog.

