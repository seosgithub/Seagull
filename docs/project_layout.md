#Project Layout
The project is layed out with the following folders:
  * `./services` - The *node.js* code that assists the GUI app. It is appended to the final `index.html`, see [Build](./build.md) for details
  * `./gui` - A [*node-webkit*](nwjs.io) based GUI frontend for the *services*.
  * `./app` - A flok application that controls the `gui` application. This is builld and the flok *js* files are appended to the final `index.html`.
      See [Build](./build.md) for details
