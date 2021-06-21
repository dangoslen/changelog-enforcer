# CHANGELOG
Inspired from [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

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
- Bumps `ws` from 7.4.0 to 7.4.6

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