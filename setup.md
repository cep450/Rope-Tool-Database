
#Database setup 
To open mongodb shell: 
mongosh 

To create the database: 
use rope-tool-database

#Running
If connecting over the internet: 
- Port forward the port. 
- Allow incoming traffic through the firewall for the port. 
Always: 
- Remember to set the environment variables, or set up a bat script to set them. 
- Make sure "Quick Edit Mode" is UNCHECKED on cmd under properties.
Finally:
npx nodemon app.mjs 


