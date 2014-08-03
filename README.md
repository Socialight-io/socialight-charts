socialight-charts
=================

Angular module that provides support for D3 charts

###Installing

#### Via Bower

Install this module using Bower: `bower install socialight-charts --save`  

Then include the the module's css and script files in your app: 
```
<link rel="stylesheet" href="bower_components/socialight-charts/dist/styles/main.css">

<script src="bower_components/socialight-charts/dist/scripts/vendor.js"></script>
<script src="bower_components/socialight-charts/dist/scripts/scripts.js"></script>
```

Now the module should be avilible for you to include in your angular app.

###Running (testing) the Module

Clone this repo and run the following commands to set up the dependancies:

`npm install`  

`bower install`

Then:

Run `grunt serve` to run the app in the dev enviornment

Run `grunt serve:dist` for the production enviorment

A basic demo page should load and display examples of the different types of supported charts
