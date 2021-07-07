[![Build Status](https://travis-ci.com/cloudmosaic/cloud-tutorials-frontend?branch=master)](https://travis-ci.org/cloudmosaic/cloud-tutorials-frontend)

# cloud-tutorials-frontend
Launcher app for multi-application cloud tutorials. Includes additional `quickstarts.js` script for external websites.

## Running launcher app and quickstarts locally
Requirements:
  - [node>=12](https://nodejs.org/en/download/)
  - [Docker](https://docs.docker.com/get-docker/)

`npm i && npm start`

### Launcher app
Browse to http://localhost:1337/apps/cloud-tutorials/
  - Accept cert
  - Can use credentials user/user or admin/admin

### Quickstarts drawer
- Install chrome addon at chrome://extensions/
  - Check developer mode in top right
  - Select "Load unpacked" and pick ./src/quickstarts/chrome-plugin
- Browse to any website (currently targeting cloud.redhat.com, can open ./src/quickstarts/test.html for a non-patternfly example)
  - Click chrome extension icon in toolbar to inject drawer

