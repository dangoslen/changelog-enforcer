# CHANGELOG

Inspired from [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [UNRELEASED]
### Changed
- Fix Github Actions Annotations ([#281](https://github.com/dangoslen/changelog-enforcer/pull/281))

## [v3.6.0]
### Changed
- Now runs on Node 20
  - Updates `.nvmrc` to set the version
  - Updates node version in `action.yml`
### Dependencies
- Bump `node-fetch` from 2.6.12 to 2.7.0 ([#264](https://github.com/dangoslen/changelog-enforcer/pull/264), [#270](https://github.com/dangoslen/changelog-enforcer/pull/270))
- Bump `actions/checkout` from 3.5.3 to 4.1.1 ([#266](https://github.com/dangoslen/changelog-enforcer/pull/266), [#267](https://github.com/dangoslen/changelog-enforcer/pull/267), [#271](https://github.com/dangoslen/changelog-enforcer/pull/271), [#275](https://github.com/dangoslen/changelog-enforcer/pull/275))
- Bump `@vercel/ncc` from 0.36.1 to 0.38.1 ([#268](https://github.com/dangoslen/changelog-enforcer/pull/268), [#276](https://github.com/dangoslen/changelog-enforcer/pull/276))
- Bump `jest` from 29.6.2 to 29.7.0 ([#269](https://github.com/dangoslen/changelog-enforcer/pull/269))
- Bump `stefanzweifel/git-auto-commit-action` from 4.16.0 to 5.0.0 ([#272](https://github.com/dangoslen/changelog-enforcer/pull/272))
- Bump `@actions/github` from 5.1.1 to 6.0.0 ([#273](https://github.com/dangoslen/changelog-enforcer/pull/273))
- Bump `@actions/core` from 1.10.0 to 1.10.1 ([#274](https://github.com/dangoslen/changelog-enforcer/pull/274))
- Bump `eslint` from 8.46.0 to 8.56.0 ([#279](https://github.com/dangoslen/changelog-enforcer/pull/279))

## [v3.5.1]
### Security
- Removes `uglify-js` and `dist` packages

### Dependencies
- Bump `jest` from 29.5.0 to 29.6.2 ([#260](https://github.com/dangoslen/changelog-enforcer/pull/260))
- Bump `eslint` from 8.42.0 to 8.46.0 ([#261](https://github.com/dangoslen/changelog-enforcer/pull/261))

## [v3.5.0]
### Dependencies
- Bump `@vercel/ncc` from 0.34.0 to 0.36.1 (#247)
- Bump `eslint` from 8.31.0 to 8.42.0 (#249)
- Bump `actions/checkout` from 3.5.2 to 3.5.3 (#250)
- Bump `node-fetch` from 2.6.9 to 2.6.12 (#251, #253)

### Fixed
- Handle `skipLabels` that contain a `/` (#254)

## [v3.4.0]
### Changed
- Switches the default branch from `master` to `main`

### Dependencies
- Bump `actions/checkout` from 3.2.0 to 3.5.2 (#245)
- Bump `jest` from 29.3.1 to 29.5.0 (#242)
- Bump `node-fetch` from 2.6.7 to 2.6.9 (#241)

## [v3.3.2]
### Fixed
- Properly rebuilds the `dist.index.js` meant to be built in `v3.3.1`.

## [v3.3.1] - YANKED

_This release has been yanked and should not be used. Please use `v3.3.2` instead. The tag for this release will be deleted on `2023-06-01` and will not be usable after that date. If you are using the `v3` tag, you will get the latest version automatically._

### Fixed
- Removes the deprecated `set-output` command by bumping `@actions/core`. This fixes [issue #222](https://github.com/dangoslen/changelog-enforcer/issues/222)

### Dependencies
- Bumps `@vercel/ncc` from 0.33.4 to 0.34.0
- Bumps `stefanzweifel/git-auto-commit-action` from 4.15.4 to 4.16.0
- Bumps `jest` from 29.2.2 to 29.3.1
- Bumps `actions/checkout` from 3.1.0 to 3.2.0
- Bumps `@actions/github` from 5.0.2 to 5.1.1
- Bumps `eslint` from 8.2.0 to 8.31.0
- Bumps `dangoslen/dependabot-changelog-helper` from 2 to 3
- Bumps `@actions/core` from 1.9.0 to 1.10.0

## [v3.3.0]
### Dependencies
- Bumps `stefanzweifel/git-auto-commit-action` from 4.14.1 to 4.15.4
- Bumps `actions/checkout` from 3.0.2 to 3.1.0
- Bumps `@actions/core` from 1.6.0 to 1.9.0
- Bumps `uglify-js` from 3.15.5 to 3.17.4
- Bumps `jest` from 27.3.1 to 29.2.2

## [v3.2.1]
### Changed
- `expectedLatestVersion` no longer enforces validation if the only version in the changelog is an unreleased version.
  - See more in the [README](./README.md#expectedlatestversion)

## [v3.2.0]
### Changed
- Now runs on Node 16
  - Adds `.nvmrc` to set the version
  - Updates node version in `action.yml`
### Dependencies
- Bumps `uglify-js` from 3.14.3 to 3.15.5
- Bumps `@actions/github` from 5.0.0 to 5.0.2
- Bumps `stefanzweifel/git-auto-commit-action` from 4.14.0 to 4.14.1

## [v3.1.0]
### Fixes
- Fixes issue #184
  - Get changelog from the `contents_url` instead of the `raw_url`
### Dependencies
- Bumps `actions/checkout` from 2.4.0 to 3.0.2
- Bumps `stefanzweifel/git-auto-commit-action` from 4.13.1 to 4.14.0
- Removed `@actions/exec`
- Bumps `@vercel/ncc` from 0.31.1 to 0.33.4

## [v3.0.1]
### Dependencies
- Bumps `stefanzweifel/git-auto-commit-action` from 4.11.0 to 4.13.1
- Bumps `@vercel/ncc` from 0.31.1 to 0.33.4

## [v3.0.0]
:rocket: The 3.0.0 release of the Changelog Enforcer is here! This release relies soley on the GitHub API instead of local git commands from a cloned repository. This means, for example, that `actions/checkout` does **not** need to be run before running the enforcer.
### Fixes
- Fixes issue #142
### Dependencies
- Bumps `@vercel/ncc` from 0.28.6 to 0.31.1
- Bumps `@actions/core` from 1.4.0 to 1.6.0
- Bumps `jest` from 27.0.5 to 27.3.1
- Bumps `actions/checkout` from 2.3.4 to 2.4.0
- Bumps `uglify-js` from 3.13.9 to 3.14.3
- Bumps `eslint` from 7.28.0 to 8.2.0

## [v2.3.1]
### Changed
- Only runs on `pull_request` and `pull_request_target` events. This is to address issue #140

## [v2.3.0]
### Dependencies
- Bumps `lodash` from 4.17.19 to 4.17.21
- Bumps `stefanzweifel/git-auto-commit-action` from 4 to 4.11.0
- Bumps `actions/checkout` from 2 to 2.3.4
- Bumps `actions/create-release` from 1 to 1.1.4
- Bumps `uglify-js` from 3.13.3 to 3.13.9
- Bumps `eslint` from 7.25.0 to 7.28.0
- Bumps `@vercel/ncc` from 0.28.2 to 0.28.6
- Bumps `@actions/github` from 4.0.0 to 5.0.0
- Bumps `dangoslen/dependabot-changelog-helper` from 0.3.2 to 1
- Bumps `@actions/exec` from 1.0.4 to 1.1.0
- Bumps `@actions/core` from 1.2.7 to 1.4.0
- Bumps `jest` from 26.6.3 to 27.0.5
- Bumps `ws` from 7.4.0 to 7.5.3

## [v2.2.0]
### Changed
- The `pull_request` workflow now executes as a `pull_request_target` workflow to handle incoming pull requests from forked repos.
  - This is needed because Dependabot now works as a [forked branch](https://github.blog/changelog/2021-02-19-github-actions-workflows-triggered-by-dependabot-prs-will-run-with-read-only-permissions/). The reasoning and ways to accommodate are listed in a [GitHub Security article](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/)
  - The `verified` label is needed to allow the workflow to execute
### Dependencies
- Bumps `uglify-js` from 3.13.2 to 3.13.3
- Bumps `y18n` from 4.0.1 to 5.0.8
- Bumps `@vercel/ncc` from 0.27.0 to 0.28.2
- Bumps `@actions/core` from 1.2.6 to 1.2.7
- Bumps `eslint` from 7.23.0 to 7.25.0
- Bumps `hosted-git-info` from 2.8.8 to 2.8.9

## [v2.1.0]
### Deprecated
- The input `versionPattern` is now deprecated. Starting in `v3.0.0` the Changelog Enforcer will only work with [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) for verifying the latest expected version.
### Dependencies
- Bumps `eslint` from 7.21.0 to 7.23.0
- Bumps `uglify-js` from 3.13.0 3.13.2

## [v2.0.2]
### Changed
- Minor changes to workflows to use `package.json` version
- Minor changes to tests and names
### Dependencies
- Bumps `uglify-js` from 3.12.1 to 3.13.0
- Bumps `eslint` from 7.20.0 to 7.21.0

## [v2.0.1]
### Dependencies
- Bump `eslint` from 7.17.0 to 7.20.0
- Bump `@vercel/ncc` from 0.26.1 to 0.27.0
### Changed
- Now reads the version from `package.json` instead of from `VERSION`

## [v2.0.0]
### Added
- Feature request from #62
  - Adds a new property `missingUpdateErrorMessage` for passing a custom error message when no update is found to the changelog. See the [Inputs / Properties](https://github.com/dangoslen/changelog-enforcer#inputs--properties) section in the `README.md` for more information.
  - Adds a new output `errorMessage` that states why the Changelog Enforcer failed. Added to allow users to use the error message within the rest of the action workflow.
### Dependencies
- Bumps `@vercel/ncc` from `0.25.1` to `0.26.1` (#63)
- Bumps `eslint` from `7.15.0` to `7.17.0` (#64, #70)
- Bumps `node-notifier` from `8.0.0` to `8.0.1` (#65)

## [v1.6.1]
### Fixed
- Fixes #58 by properly accounting for whitespace characters in label names.

## [v1.6.0]
### Added
- New `skipLabels` input variable to supply a list of labels to skip enforcement for. See the [Inputs / Properties](https://github.com/dangoslen/changelog-enforcer#inputs--properties) section in the `README.md` for more information.
### Changed
- Deprecates the `skipLabel` input variable in favor of the `skipLabels` input variable
### Dependencies
- `eslint` from `7.14.0` to `7.15.0`
- `uglify-js` from `2.6.0` to `3.12.1`
- `jest` from `24.9.0` to `26.6.3`

## [v1.5.1]
### Added
- Improved GitHub actions workflow for testing and packaging
- Preview of release notes for a new version
### Dependencies
- `@actions/exec` from `1.0.3` to `1.0.4`
- `@actions/github` from `2.1.1` to `4.0.0`
- `eslint` from `6.3.0` to `7.14.0`
- `changelog-reader-action` from `v1` to `v2`

## [v1.5.0]
### Added
- New input parameter `expectedLatestVersion`.
  - When supplied, the Changelog Enforcer validates that this is the latest version in the changelog or the latest version after an "Unreleased" version if one exists.
- New input parameter `versionPattern`.
  - Used in conjunction with `expectedLatestVersion`. This is a javascript string that is converted to a regular expression that is used to extract the versions in the changelog identified by the `changeLogPath` input. By default is uses a regular expression for the [KeepAChangelog.org format](https://keepachangelog.com/en/1.0.0/).
### Changed
- Updates to `README` and `CHANGELOG` for new features

## [v1.4.1]
### Security
- `@actions/core@1.1.1` to `@actions/core@1.2.6`
### Adds
- Badge for workflows using this action

## [v1.4.0]
### Summary
Please upgrade to use with `actions/checkout@v2`!
### Fixes
- Now works with both `actions/checkout@v1` and `actions/checkout@v2`
### Adds
- Code coverage checks via `jest` and coverage badge via `make-coverage-badge`

## [v1.3.0]
### Security
- `node-fetch@2.6.0` to `node-fetch@2.6.1`
- `yargs-parser@13.1.1` to `yargs-parser@13.1.2`

## [v1.2.0]
### Added
- Automatically builds the distribution on pull requests if all tests and enforcement pass

### Updated
- Small `README` updates

## [v1.1.2]
### Security
- `lodash@4.17.15` to `lodash@4.17.19`

## [v1.1.1]
### Fixes
- Referencing proper step id in workflow for creating releases

## [v1.1.0]
### Added
- Using [Changelog Reader](https://github.com/marketplace/actions/changelog-reader) to automate creating GitHub Releases from this `CHANGELOG.md`

## [v1.0.2]
### Security
- Update uglify-js to 2.6.0 per [CVE-2015-8857](https://github.com/advisories/GHSA-34r7-q49f-h37c)

## [v1.0.1]
### Fixed
- Fixes spelling of `skipLabel` property in `README.md`

## [v1.0.0]
### Added
- Adds updates to the `README.md` and `action.yaml` to prepare to the GitHub marketplace

## [v0.1.0]
- Initial `Changelog Enforcer` functionality, including the use of a label to skip
