# HonkedIn
Welcome to the HonkedIn repository! HonkedIn is a web application built with React and Node.js to provide students with a platform to connect with each other, create and join groups, and share content.

## Table of Contents
* [Configuration](#Configuration)
* [Installation](#Installation)
* [Getting Started](#getting-started)
* [Version Control Guide](#version-control-guide)
  * [Branching](#branching)
  * [Commits](#commits)

## Configuration

This application requires certain environment variables to be set in order to connect to Firebase and the database.

To set these variables, do the following:
1. Create a `env.local` file in the root directory of the project with the following contents:
    ```
    REACT_APP_API_ENDPOINT=http://localhost:5000/api
    REACT_APP_FIREBASE_API_KEY=<your-firebase-api-key>
    REACT_APP_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
    REACT_APP_FIREBASE_PROJECT_ID=<your-firebase-project-id>
    REACT_APP_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
    REACT_APP_FIREBASE_APP_ID=<your-firebase-app-id>
    ```

2. Create a `config.js` file in the root directory of the project with the following contents:
    ```
    let config = {
      host: '<your-mysql-host>',
      user: '<your-mysql-user>',
      password: '<your-mysql-password>',
      database: '<your-mysql-database>'
    };

    module.exports = config;
    ```

Note that these values should be kept confidential and not shared publicly.

To configure the database, follow the steps below:
1. In MySQL Workbench or another MySQL client, connect to the MySQL server that will host the database. 
2. Open the SQL files containing the schema. The files can be found in the `/schema/` directory. 
3. Execute the SQL commands in the file to create the necessary tables and relationships.
4. Verify that the schema was created correctly by checking the table structure and data.

## Installation
To install HonkedIn, first clone the repository:

### `git clone https://github.com/Safewaan/HonkedIn.git`

Then install dependencies:

### `npm install`

## Getting Started

To start the application in development mode, run:

### `npm start`

To build the application for production, run:

### `npm run build`

To run the test suite, run:

### `npm test`

To open Cypress for end-to-end testing, run:

### `npm run cypress`

## Version Control Guide

### Branching
* Branch off of `main` for all feature work and bug fixes, creating a "feature branch". Prefix the feature branch name with your GitHub username. The branch name should be in kebab case and it should be short and descriptive. E.g. `Safewaan/readme-update`

### Commits
* Commits should be atomic (guideline: the commit is self-contained; a reviewer could make sense of it even if they viewed the commit diff in isolation)
* PRs can contain multiple commits, they do not need to be squashed together before merging as long as each commit is atomic. Our repo is configured to only allow squash commits to `main` so the entire PR will appear as 1 commit on `main`, but the individual commits are preserved when viewing the PR.

---