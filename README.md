# apollo-link-electron

Get GraphQL results over IPC for Electron apps.

This project is **WORK IN PROGRESS**, do **NOT** try to use it :trollface:

# Installation

```sh
npm i apollo-link-electron
```

## Usage

Import and initialize this link in just two lines:

```js
import { createElectronLink } from "apollo-link-http";

const link = createElectronLink({ channel: "graphql-electron" });
```

---

<p align="center">MIT &copy; <a href="https://github.com/firede">Firede</a>, built with :coffee: &amp; :sparkling_heart:<p>
