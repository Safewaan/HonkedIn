# HonkedIn
Welcome to the HonkedIn repository! HonkedIn is a web application built with React and Node.js to provide students with a platform for networking and building communities. 

## Table of Contents
* [Getting Started](#getting-started)
* [Version Control Guide](#version-control-guide)
  * [Branching](#branching)
  * [Commits](#commits)

## Getting Started

Once you have a local copy of the repo, run the following command to install the required packages and dependencies:
```
npm install --legacy-peer-deps
```

**Make sure to run this command both in the main directory and the client directory.** 

Once you have the required packages/dependencies, build and run the system using the following command in the main directory:
```
yarn dev
```

If everything installed and deployed correctly, you can locally access the application [here](http://localhost:3000/).

## Version Control Guide

### Branching
* Branch off of `main` for all feature work and bug fixes, creating a "feature branch". Prefix the feature branch name with your GitHub username. The branch name should be in kebab case and it should be short and descriptive. E.g. `Safewaan/readme-update`

### Commits
* Commits should be atomic (guideline: the commit is self-contained; a reviewer could make sense of it even if they viewed the commit diff in isolation)
* PRs can contain multiple commits, they do not need to be squashed together before merging as long as each commit is atomic. Our repo is configured to only allow squash commits to `main` so the entire PR will appear as 1 commit on `main`, but the individual commits are preserved when viewing the PR.

---