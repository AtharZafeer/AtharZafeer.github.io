# Neighborhood-Map-React
A single-page web application, built using the React framework, that displays a Google Map of an area and various points of interest. Users can search all included landmarks and, when selected, additional information about a landmark is presented from the FourSquare APIs.

This application follow this [Udacity Project Rubric](https://review.udacity.com/#!/rubrics/1351/view)

## How to run:
Make sure that you have Node.js installed on your device and then clone the repository.
Navigate to the directory that contains the project and write:
```
npm install
```
once everything is setup run:
```
npm start
```
The browser should automatically open the app.  If it doesn't, navigate to [http://localhost:3000/](http://localhost:3000/)

NOTE: Service worker for this app will only work when the app is in production mode.
## Loading the App in Production Mode:
To run the app in production mode run:
```
npm run build
```
Then navigate to the build directory and start a localhost with python
```
python -m SimpleHTTPServer 8000
```
After that navigate to [http://localhost:8000](http://localhost:8000) in your browser.

## Enjoy.
