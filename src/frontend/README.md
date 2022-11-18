# Getting Started with SI Mapping System Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
## Introduction

This project is a management system based on `React` + `Typescript` for the purpose of curriculum mapping for Science Island.  `Ant Design` is a UI component library.  `Eslint` and `Prettier` are used to strictly regulate code.

## Source code `src` folder Structure

| File/Folder      | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| ├── `api`        | Request management and APIs.                                 |
| ├── `components` | Reusable components.                                         |
| ├── `containers` | Pages.                                                       |
| ├── `routers`    | Routing registration.                                        |
| ├── `store`      | Redux store and reducers for status management.              |
| ├── `utils`      | Common utility functions, style libraries and constant pools. |

## Prerequisites

You'll need Node and NPM installed on your computer to start the development environment.

You can run the following command to check whether they are installed and their versions:
```shell
node --version # 16.14 or higher
npm --version # 8.3.1 or higher
```

## Getting started

If you are trying to start the development environment for this project for the first time, execute `npm install`, followed by `npm start`, after making sure you have the [Node.js](https://nodejs.org/en/download/) environment locally.

### Install dependencies

```shell
cd src/frontend
npm install
```

### Start development server

```shell
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Coding Standards

Eslint and Prettier are used in the development of the project to ensure that code is standardized, so there will be errors when non-standard code occurs during development and maintenance.  It can be automatically repaired by running the following command on the terminal.
```shell
npx prettier --write [file or directory path]
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
