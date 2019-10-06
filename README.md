# Project Issues Suite

The Project Issues Suite (PIS) is designed to be a web application that facilitates the use of videos to display bugs and other issues related to other software projects.

## Getting Started

### Software dependencies

- Axios 0.18.0
- Babel 7.0.0
- jQuery 3.3.1
- jsrsasign 8.0.12
- Node.js 10.9.0 and npm 6.2.0. Using node version 11+ may not work for installing Semantic UI.
- React/React DOM 16.4.2
- React Router DOM 4.3.1
- React Player 1.8.0
- Redux 4.0.1
- Sass-loader 7.1.0
- Semantic UI React 0.83.0
- Toastr 2.1.4
- WebPack 4.8.3

Check package.json file for full list of dependencies

### Requirements

- For **microsoft login** to work, it may be necessary to replace .env.development's CLIENT_ID with your own (please follow env.example file at root of this project)
- For the app to work a **backend** is required. The environment variables in .env.development file is currently setup to use the production version. To use a local version, follow the README for the [Project Issues Suite API](https://github.com/jeffvhuang/Project-Issues-Suite-API).

### Installation

1. Clone project into a directory `git clone https://github.com/jeffvhuang/Project-Issues-Suite`
2. `cd Project-Issues-Suite/`
3. `npm install`. If using Node 11+, it may be necessary to install and use an older version of node. See below for instructions for this.
   You will also be asked questions during installation of semantic ui.
4. Rebuild sass `npm rebuild node-sass`
5. `npm start` and the web app should open up in a browser. Check to see that it works.

#### Installing Older Node Version

This method will use Ubuntu for the linux environment to be able to use `curl` and `nvm` (Node verison Manager).

1. Ensure a linux cli is available (eg. [Ubuntu on windows](https://tutorials.ubuntu.com/tutorial/tutorial-ubuntu-on-windows#0))
2. On the linux cli, navigate to the project directory. eg. `cd /mnt/c/source/repos`
3. Install nvm `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash`
4. Restart the terminal and navigate to the same location.
5. Using nvm, install an older verison of node. `nvm install 10.15.2`. Use `nvm ls` to list versions.
6. This installed version should be the one being used, otherwise select it `nvm use 10.15.2`.

### Compatibility of Sass with Semantic UI React

Sass was chosen to be used as a CSS preprocessor to assist with styling of the web app. Much later the Semantic UI React UI component framework was used to reduce the need for design work. To be able to override css of Semantic UI React components, `!important` may need to be used in some properties in Sass.

## Build and Test

Run `npm run build` to build.

Run `npm test` to run the tests.

## Production

The produced app can be seen at [https://project-issues-suite.azurewebsites.net](https://project-issues-suite.azurewebsites.net).

### Preview

The following instructions can be used to test an optimized production version.

1. `cd Project-Issues-Suite` to be in the root directory of the project
2. Follow the instructions in env.README.example to create your .env.production file. (this is not committed to the git repository)
3. `npm run build` will create a build directory in the root location
4. `npm install -g http-server` to install the http npm package globally
5. `cd build`
6. `http-server`
7. Navigate to http://localhost:8080 in your browser to see the production version running

### Deployment

Subscription to the TechAcademy resource group on Microsoft Azure is required if changes need to be made to the TUS frontend App Service. To simply deploy to production, only access to the TechAcademy Project on TFS is required.

TFS CI/CD pipeline is already set up for all successful release branches to automatically deploy to Azure App Service. The [Gitflow workflow design](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) should be followed when making changes to the app:

1. Make pull requests from feature branches into develop branch via TFS.
2. Once changes are merged into develop branch and a release is ready to be created, fetch all committed changes of develop branch onto local machine.
3. Create a release branch `git branch release/vx.x.x` where x should be an integer (eg. `git branch release/v1.9.0`).
4. Push the new branch to remote `git push origin <release_branch_name>` (eg. `git push origin release/v1.9.0`).
5. If the release build is successful on TFS, the release should automatically be deployed to production.
