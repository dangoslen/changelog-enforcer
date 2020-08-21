# CHANGELOG

Inspired from [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

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
