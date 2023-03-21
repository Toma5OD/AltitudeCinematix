# AltitudeCinematix

AltitudeCinematix is an application that uses Ionic, React, and Firebase for authentication, database, and storage. The app is designed to showcase aesthetic and visually pleasing videos, with a focus on background content such as drone footage, nature videos, and animations.
<br>
<br>
## Prerequisites

Before running this project, you will need to create a file called `firebaseCredentials.ts` in the `src` folder. This file should contain the Firebase configuration information needed to connect to your Firebase project. Here's an example of what this file should look like:
<br>

```
const config = {
	apiKey: "<YOUR-API-KEY>",
	authDomain: "<YOUR-AUTH-DOMAIN>",
	databaseURL: "<YOUR-DATABASE-URL>",
	projectId: "<YOUR-PROJECT-ID>",
	storageBucket: "<YOUR-STORAGE-BUCKET>",
	messagingSenderId: "<YOUR-MESSAGING-SENDER-ID>",
	appId: "<YOUR-APP-ID>",
	measurementId: "<YOUR-MEASUREMENT-ID>"
};

export default config;
```
<br>
Note that all personal details have been removed from this example. You should replace the placeholders with your own Firebase project's configuration details.

To run this project, you should use the latest stable release of Node.js, which is currently version v18.15.0. Using this version is advised for optimal performance and compatibility.

Node.js version 19 is currently incompatible with some of the dependancies included in this project.
<br><br>
## Installation

To run this project locally, clone this repository and run the following commands:
<br>

```
npm install
npm start
```
<br>
This will start the development server at `http://localhost:3000`.

<br>
<br>
## Usage

To use the AltitudeCinematix app, simply log in with your Firebase authentication credentials and browse the available videos.

## Contributing

This project is not currently accepting contributions. If you find a bug or would like to suggest a feature, please open an issue on the project's GitHub page.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
