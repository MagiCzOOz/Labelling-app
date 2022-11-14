# Video Annotation App

## Description

This Web app allows you to easily tag video clips with predefined labels. It can be used by a multitude of users simultaneously. The resulting dataset is stored in an SQL database and can be directly used for machine learning purposes.

This project is fully written in [TypeScript](https://www.typescriptlang.org/). The client has been implemented in [React](https://reactjs.org/) and bootstrapped using [Creat React App](https://github.com/facebook/create-react-app). The server uses [Node.js](https://nodejs.org/), [express](https://expressjs.com/), and [MySQL](https://www.mysql.com).

The tool comes with a simple, secure, and convenient authentication mechanism allowing an evaluation of the label distribution among each user and therefore detecting and filtering potential user biases in the annotation.
<a name="screenshot"></a>
![Screenshot from 2022-11-09 18-16-50.png](./_resources/Screenshot_1.png)


Clips of an arbitrary predetermined duration can be played an indefinite number of times before being labeled by the user through a checkbox system (allowing multi-label classification).
Previously tagged clips can be recalled by the user through the upper right video thumbnail to update the labels if errors have been made.
The table on the right provides information about the current state of the dataset by displaying the number of clips bearing each label.

## Usage

This document will describe installation on Ubuntu 20.04+, however, it should work with any operating system.

### Prerequisites

- A folder containing all the videos you need to annotate with one of the following extensions: '.3gp', '.mpg', '.mpeg', '.mp4', '.m4v', '.m4p', '.ogv', '.ogg', '.mov', '.webm'.
    
- [Install and setup MySQL](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04) on your server. This app has been tested with the current default version available on the APT package repository.
    
- It is recommended to create a new database specifically for this app. First, log in to the MySQL Server using a user account that has the `CREATE DATABASE` privilege and execute the command with a name of your choice:
    
    ```MYSQL
    mysql> CREATE DATABASE dbname;
    ```
    
- Install [Node.js](https://nodejs.org/) and `npm` the Node.js package manager
    ```sh
    # refresh your local package index
    $ sudo apt update
    
    # install Node.js
    $ sudo apt install nodejs
    
    # install npm
    $ sudo apt install npm
    ```
    
- Install the multimedia framework [ffmpeg](https://ffmpeg.org/documentation.html) and the [ffprobe](https://ffmpeg.org/ffprobe.html) tool
    ```sh
    # refresh your local package index
    $ sudo apt update
    
    # install ffmpeg
    $ sudo apt install ffmpeg
    
    # install ffprobe
    $ sudo apt install ffprobe
    ```
    
- \[OPTIONAL\] Set up a reverse proxy like [Nginx](https://nginx.org/en/docs/) or [Apache](https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html) to improve the performance and security of the app.

### Getting started

To host the app on your server or VM with minimal effort:

1.  Clone this repository
    
    ```sh
    $ git clone https://github.com/MagiCzOOz/labellingApp
    ```
    
2.  Edit the JSON file `./server/config/labelsconfig.json` with your labels :
    
    ```json
    {
       "labels": {
           "groupLabels1": ["label1", "label2", "label3", "label4"],
           "groupLabels2": ["labelA", "labelB", "labelC", "labelD"]
       },
       "issues": ["toDelete", "uncategorized"]
    }
    ```
    
    - You can add or delete groups of any number of labels. To ensure the proper functioning of the app, declare the labels in camelCase or PascalCase. They will be displayed appropriately on the browser.
    - The `issues` are treated in the SQL database as normal labels but are more readily accessible by the user thanks to dedicated buttons (cf [screenshot](#screenshot)).
    - There are two levels of "issues", illustrated here by <span style="color: orange;">uncategorized</span> and <span style="color: red;">toDelete</span>. You can keep either a single one or none but in this case, make sure to **leave an empty list** (cf [the appendix](#confexamples) for working examples). The <span style="color: red;">strong issue</span> needs to be at index 0 and the <span style="color: orange;">weak issue</span> at index 1.
3.  Create a server environment file at the root of the server folder `./server/.env`.
    
    ```sh
    $ touch ./server/.env
    ```
    
    Edit the file to declare the following variables :
    
    | **Variable** | **Description** | **Required** |
    | --- | --- | --- |
    | `DB_NAME` | SQL database name. It is recommended to use a database strictly dedicated to this application | Required |
    | `DB_HOST` | The hostname of the database you are connecting to. *(Default: localhost)* | Optional |
    | `DB_USER` | The MySQL user to authenticate as. This user only needs permission to read and create tables in the database. | Required |
    | `DB_PSWD` | The password of that MySQL user. | Required |
    | `DB_CONNECTION_LIMIT` | The maximum number of connections to create at once. *(Default: 40)* | Optional |
    | `VIDEOS_DIR_PATH` | The path to the directory containing all the videos. The available formats are the video formats listed [here](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Containers). These videos will be decomposed into short clips that will be streamed to the user. | Required |
    | `CLIPS_DURATION` | The duration of the clips in seconds. *(Default: 4)* | Optional |
    | `JWT_SECRET_KEY` | The string, buffer, or object containing either the secret for HMAC algorithms or the PEM-encoded private key for RSA and ECDSA. | Required |
    | `SESSION_SECRET_KEY` | The secret used to sign the session ID cookie. This must be a string that should be not easily parsed by a human and would best be a random set of characters. | Required |
    | `SERVER_PORT` | The port on which the application will be served. *(Default: 4000)* | Optional<br>*WARNING: Become required if the port 4000 is already used.* |
    | `MAX_CLIP_DEPTH` | The maximum number of clips previously annotated by a user that can be retrieved and re-edited. *(Default: 40)* | Optional |
    | `NODE_ENV = production` | Set the environment to production. Remove it if you run it for development. | Required |
    
4.  Install client dependencies and build the React app
    
    ```sh
    # move to client folder
    $ cd client/
    
    # install dependencies
    $ npm install
      
    # build the React client
    $ npm run build  
    ```
    
5.  install server dependencies
    
    ```sh
    # move to servert folder
    $ cd server/
    
    # install dependencies
    $ npm install 
    ```
    
6.  Serve the app using PM2 or the process manager of your choice
    
    ```sh
    $ pm2 start npm --name labellingApp -- start
    ```
    
7.  Users can now access the app through the LAN or public IP address of the server. They need to create an account before they start labeling clips.
    
### Database

At the start, the server will check the existence of the `clips`, `users`, and `sessions` tables in the SQL database and will create them accordingly. The users info are stored in the `dbname.users` table, the sessions info in the `dbname.sessions` table and the dataset info in `dbname.clips`.

If the `clips` table needs to be created (at the first start or if you decide to manually delete it or even if you change the database name in the environment file) it will be filled as follow. Every video contained in the folder `VIDEOS_DIR_PATH` will be subdivided into clips of `CLIPS_DURATION` seconds. This way a row will be added for each clip with an `id`, `videoName`, `starTime` and `endTime` column.
In addition, a column will be created for each label as well as a `labelledBy` column. Finally, the table is shuffled to reduce the repetitiveness of the task by switching from one video to another and thus avoid some errors of inattention to the users.

![Screenshot from 2022-11-09 10-23-57.png](./_resources/Screenshot_2.png)

- The `labelledBy` variable can take the following values :

  | `labelledBy`         | Description                                                                             |
  |----------------|-----------------------------------------------------------------------------------------|
  | 0              | The clip has never been labelled yet.                                                   |
  | **-**`user_id` | The clip has been sent to the user with the ID `user_id` but has not been labelled yet. |
  | `user_id`      | The clip has been labelled by the user with the ID `user_id`.                           |

- The labels variables (illustrated here by `label1`, `label2`, ... ,`toDelete`) can take the following values :

  | `labels` | Description                                                         |
  |--------|---------------------------------------------------------------------|
  | -1     | Not labelled yet. This is the case when `labelledBy` is equal or inferior to 0. |
  | 0      | Inactive label. Equivalent to false.                                |
  | 1      | Active label. Equivalent to true.                                   |

Multi-labels are allowed except for `issues` in which case there can be only one active label. (This is handled by the client: *If a user checks several label boxes and then clicks on one of the `issues` buttons, the clip will only have the `issues` label active.*)

### Logs
The server logs are available in the `./server/logs/` folder. They are divided into two categories: the logs related to authentication and those related to the overall functioning of the app. For each of these categories, a new file is created per day in the format `categorie-YYYY-MM-DD.log`. If the log file exceeds 20MB another one will be created for the current day. The log files are automatically deleted after 14 days.

### Development

To run the app in a development environment, you should add :

- The CORS policies in the `./server/app.ts` file allowing the client and the server to run on different ports. Don't forget to add the `CORS_ORIGIN` variable to the server environment file `./server/.env` with the IP address and port of the client.
    
    ```javascript
     import cors from 'cors';
    
     app.use(
        cors({
           origin: process.env.CORS_ORIGIN,
           methods: ['GET', 'POST'],
           credentials: true,
        }),
     );
    ```
    
- Edit the environment file for the client `./client/.env` with the IP address of the server.
- Install client dependencies and start the client
    ```sh
    # move to client folder
    $ cd client/
    
    # install dependencies
    $ npm install
      
    # start the React client on default port 3000
    $ npm run start 
    ```
- Install server dependencies as well as the cors package and types definition and start the server
    ```sh
    # move to server folder
    $ cd server/
    
    # install dependencies
    $ npm install
		 
	# install cors package
	$ npm install --save cors
	
	# install cors types definition
	$ npm install --save-dev @types/cors
	
	# start the server
	$ npm start
    ```

## Appendix

### <a name="confexamples"></a>`labelsconfig.json` examples

1.  With only one group and one issue :
    
    ```json
    {
       "labels": {
           "motion": ["walk", "run", "jumpUp", "jumpDown", "motionless"]
       },
       "issues": ["noHuman"]
    }
    ```
    
2.  With three groups and no issue :
    
    ```json
    {
       "labels": {
           "location": ["street", "wood", "beach"],
           "motion": ["walk", "run", "jumpUp", "jumpDown", "motionless"],
           "moment": ["day", "night"]
       },
       "issues": []
    }
    ```
