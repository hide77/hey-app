## Clone the repo and submodules
`git clone --recurse-submodules -j8 git@gitlab.com:teamhey/mobile-app.git`
`cd mobile-app`

## Install packages
`npm i`

## Run the app
Make sure you have the `react-native-cli` installed on your computer.
Otherwise type `npm i -g react-native-cli`.

### iOS
`react-native run-ios`


### Android
Run an emulator then `react-native run-android`


## Code push
`npm run prod`
