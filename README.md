## What does this app do?
This app is meant to serve as a real time display of the soon to be deployed code in your project. If you are using SVN or Github along with Jira, this app will find all of the commits since the previously deployed product version (hardcoded by you for now), and then grab the associated Jira information for them. You can run the app on your team's build monitor so that you can always have a visual of how much code will go into your next deploy.

## What is the tech stack?

#### Application
*NodeJS* on the server side and Javascript on the client side using *AngularJS* framework. 

#### Test
*Mocha* with its most popular extension *Chai*. 

#### Build/Deploy
*Grunt* for build and *Vagrant* for local deploy. 

## First time running the app on your machine?

#### Prerequisites

> Mac :  None!  You should be able to run locally
> Windows : Vagrant, VirtualBox, PuTTY and PuTTY gen 

#### Steps
1.  clone the source code 
2.  add your Jira, SVN, and git credentials to the credentials.js file
3.  run this command in the root of your cloned project so that git will not try to commit any updates to the credentials file : git update-index --assume-unchanged utils/credentials.js
4.  add the names of the projects you want to track, and the revision you want to start from to dashboard.js
5.  add the information about your github, svn, and Jira hosts to the configuration.js file
6.  repeat step 3 for the dashboard.js and configuration.js files since you probably don't want to commit changes to these either

Now decide if you want to use Vagrant (if you are on Windows the answer is probably yes), or just run from your local machine.

Vagrant
1.  (Windows only) use PuTTY gen to generate a private key and save it at .vagrant.d folder in your home directory. You will see there’s already something in that folder called insecure_private_key. You want to rename it to anything else, and save the one private key you just generated with the name insecure_private_key. 
2.  do vagrant up
3.  go to the vagrant box
  - (Mac only) do vagrant ssh 
  - (Windows only) use PuTTY to ssh into localhost:2222 (vagrant port)
4.  now you’re in the box, go to the synced folder by cd /vagrant

In your Vagrant box or local machine :
1.  install all NodeJS libraries
  - (Mac only) do npm install
  - (Windows only) do npm install --no-bin-links (to avoid creating symlinks. Refer here)
2.  start the server by nodejs server.js
  - You should see localhost:8000 running on your host machine. 
  - If you want to display the dashboard on your team monitor, navigate to “your_ip_address:8000” in the browser; You might need to install some browser plugin for auto refresh.
3.  When finished, you can do vagrant halt to power off your box, or vagrant destroy to completely get rid of it. 

## Notes
The idea for this project came from Blake Norrish, and was coded in its original form by Peiying Wen and Sophie Krisch. Many thanks to our colleagues who also contributed including Ian Norris, Eswariah Bhun, and Francisco Hernandez!