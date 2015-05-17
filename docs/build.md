#Build Process

Seagull is built in multiple steps.


##GUI files
The gui files are built 

##.run file
Currently, the `.run` file handles overseeing the built.  The steps it takes are:

  1. It builds the flok app through `flok build CHROME`
  2. It copies the created flok files `chrome.js` and `application_user.js` to `./gui/app/assets/javascripts`
  3. It initiates `rake gui:build` which intern calls `Build.run` of `./gui/lib/build.rb`.

##Build.run
`Build.rb` carries out the following steps:
  1. It creates a public folder in `./gui/public`
  2. It copies all images from `./gui/app/assets/images` directly to the `./gui/public.folder`
  3. It runs an *ERB* compiler on `./gui/app/views/index.html.erb`. The *ERB* compiler has the following variables:
    * `@js` - A text tar copy of the javascript source for all `./gui/app/assets/javascripts/**/*.js` and `./services/**/*.js`.
    * `@css` - A text tar copy of all the stylesheet source in `./gui/app/assets/stylesheets/**/*.css`
    * `@html` - A html tar copy of all the HTML files in `./gui/app/views/**/*.html`
  4. The compiled `./app/views/index.html.erb` is then outputted to `./gui/public/index.html`
