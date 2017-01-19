Nuxeo Workshop REST API
========

# Client Library for Nuxeo API

The JavaScript client library for the Nuxeo Automation and REST API.

The library can work in a browser (jQuery), or in Node.js, using the same API.

# Getting Started

## Setup

Distribution and Dev mode setup:
- Get a nuxeo distribution.
- Go to `NUXEO_HOME/bin` folder.
- Execute `./nuxeoctl register`.
- Install Web UI at `./nuxeoctl mp-install nuxeo-web-ui`.
- Install JSF UI at `./nuxeoctl mp-install nuxeo-jsf-ui`.
- Open `NUXEO_HOME/bin/nuxeo.conf` file.
- Remove the line `wizard.done=false`.
- Uncomment `org.nuxeo.dev=true`.

Nuxeo Execution and Studio custom bundle setup:
- Execute `./nuxeoctl console`.
- Create into your project one document type:
  - Named `Meeting`
  - With one metadata `participants` String multivalued
  - And one metadata `meetingPublisher` complex containing `firstName` and `lastName` String
- Hotreload
