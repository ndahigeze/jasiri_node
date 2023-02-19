# JASIRI SIMULATION 

* Nodejs and HAPIJS project for managing users and their contacts

## PROCESS AND STEP FOR HOSTING THIS APPLICATION ON UBUNTU LINUX SERVER

### STEP 1: INSTALL REQUIRED LIBRARIES 
#### INSTALL NODEJS 
* install NodeSource PPA
  > curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
  
  > sudo bash nodesource_setup.sh
  
  > sudo apt install nodejs
  * Check node version 
  > node -v
* Install build-essential for packages that require compiling from source
  > sudo apt install build-essential
  
#### Pull application from git
 * Enter in project root directory and install all dependencies
   > npm install
 * Try to run the project to check if it will start
   > npm start
 * after project start you try access it on server IP ADDRESS on port 4000
    If it works you can stop it for the next process
   
### STEP 2 PREPARE .env File 
  * This project Use Mongodb for database DABASE_URL should be a link to mongoDB database
    #### Below are the required environment variables
    
   >  
    PORT=[PORT]
    DATABASE_URL=[LINK_TO_CONNECT_TO_DB]
    SESSION_PASSWORD=[PROJECT_SESSION_PASSWORD]

### STEP 3: Install PM2 (Process manager for Nodejs)
 * Install PM2 while still in projects root folder
   > sudo npm install pm2@latest -g
 #### Allow project to be managed by PM2

 * start the application With PM2
   > pm2 start app.js
   * It should output a table which has a column status=online
 * Enable application to run on system startup
   > pm2 startup systemd
   * With a new version of PM2 it will create and save PM2 process list no additional steps
 * Start PM2 service which will in turn run the projects 
   > sudo systemctl start pm2-[current system user]
 * check PM2 service status   
   > systemctl status pm2-sammy
 * Check project status with pm2 
   > pm2 monit
 
* At this point if everything is okay the project is accessible on server public IP

### STEP 4: SET UP NGINX FOR REVERSE Proxy and assign domain if you have one 

 * Create NGINX CONFIG FILE
   > sudo nano /etc/nginx/sites-available/jasiri.com
   * copy following in the file
    >  
       server {
       location / {
       proxy_pass http://localhost:[port];
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
       }
       }

* Load configurations
  > sudo nginx -t
* restart NGINX
  > sudo systemctl restart nginx
   
Application should be accessible on public IP Address or server domain name

   

 




