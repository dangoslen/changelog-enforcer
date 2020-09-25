<p align="center">
  <img src="https://github.com/dangoslen/changelog-enforcer/workflows/units-test/badge.svg?branch=master" alt="unit tests badge" />
  <img src="https://img.shields.io/github/v/release/dangoslen/changelog-enforcer?color=orange&label=Latest&style=plastic" alt="latest version" />
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
    - uses: dangoslen/changelog-enforcer@v1.1.1
      with:
        changeLogPath: 'CHANGELOG.md'
        skipLabel: 'Skip-Changelog'
```

### Inputs / Properties
There are two properties with sane defaults provided

`changeLogPath` - default: `CHANGELOG.md`
* the path to your changelog file. Should be from the perspective of the root directory to `git`. The file being checked for updates must be either an add (`A`) or modified (`M`) status to `git` to qualify as updated. 

`skipLabel` - default: `Skip-Changelog` 
* the name of a GitHub label that skips execution of the Changelog Enforcer. This is useful for small changes such as configuration that doesn't need to be reflected in the changelog. By using a label, the developer and any reviewer can agree if the change should be reflected in the changelog, and if not can apply a label. The Changelog Enforcer will re-check if the `labeled` and `unlabeled` event types are specified in the workflow.

### Creating Releases Automatically
Using this Action and the [Changelog Reader](https://github.com/mindsers/changelog-reader-action), plus a few standard GitHub created Actions, we can keep the changelog of a project up to date and create a GitHub release automatically with contents from the changelog. See this project's [release.yml](./.github/workflows/release.yml) for how to set up a simple workflow to create a new release based on a `VERSION` file and a changelog.

