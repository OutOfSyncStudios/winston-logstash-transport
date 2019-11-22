# Contributing to an **Out of Sync Studios** project

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing any of packages maintained by the [Out of Sync Studios Organization](https://github.com/outofsyncstudios) on GitHub. This should be as easy as possible for you but there are a few things to consider when contributing. The following guidelines for contribution should be followed if you want to submit a pull request.

## How to prepare

* You need a [GitHub account](https://github.com/signup/free)
* Submit an issue ticket for your issue if there is not one yet.
	* If it is a bug, describe the issue and include steps to reproduce if it's a bug.
	* If it is a new feature, describe the feature you would like added in detail.
* If you are able and want to fix this, fork the repository on GitHub then create a pull request using the guidelines below. However, please keep in mind that we carefully curate the features we allow into our modules, before submitting a PR for a feature request, please open an issue and explain what you're attempting to do.

### Bugs
Before submitting a bug issue, please perform a **[cursory search](https://github.com/search?q=+is%3Aissue+user%3Aoutofsyncstudios)** to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one. If it hasn't been reported then please open a detailed issue including steps to reproduce.

### Feature Requests
Before submitting a feature request, please perform a **[cursory search](https://github.com/search?q=+is%3Aissue+user%3Aoutofsyncstudios)** to see if the feature request has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one. If it hasn't been reported then please create a new issue detailing that it is a "***Feature Request: &lt;feature summary&gt;***" and explain the exact use-case you are attempting to accomplish and how the enhancement you are suggesting accomplishes that.


### Pull Requests
The process described here has several goals:
- Maintain the quality of the code base.
- Fix problems that are important or critical.
- Retain backwards compatibility and limit breaking changes
- Limit contributions

***NOTE: We carefully curate which features we want to add to our modules to prevent scope creep of features which are outside the scope of the goal of the projects. Before submitting a Pull Request for a feature please open an issue and explain what functionality you are looking for and the use-case for it.***

Out of Sync Studios uses a tagged release model with Git-flow. Please observe the following:
- Bug fixes should be created in your fork off the `master` branch and named with a hotfix indicator `hotfix/<your_branch_name>`.
- Features should be created in your fork off the `develop` branch with a feature indicator `feature/<your_branch_name>`
- All Pull Request should be merged back into the branch they originated from (*i.e.* `develop` for features and `master` for hotfixes).
- Pull requests that contain breaking changes, that are merged into the wrong branch, or that do not have properly tagged commits will be rejected with an explanation.
- Pull requests that do not follow the code standards will have notes attached to the styling to explain that the section of code does not follow our best practices and to recommend a change.

#### Making Changes

- Make sure you stick to the coding style that is used already by using `gulp lint` or `npm lint` with the `.eslintrc.json` file provided and not the one in your editor.
- Be sure to create a feature or bug issue before you make commits
- Make commits of logical units and describe them properly.
- Start your commit messages with the issue number they are tied to for each commit (e.g. `#1 Fixing the widget bug`)
- Let the linting tools reformat the code to fix common issues `gulp fix` or `npm fix`
- If possible, submit tests to your patch / new feature so it can be tested easily.
- Assure nothing is broken by running all the tests.
