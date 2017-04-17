# cs160-organic-food-website

### **How to install and run:** ###

Need to install node.js

Make sure you are in the main directory of the project when running commands below. 

### **Install dependencies:** ###

npm install

### **Create config file (linux):** ###

cp routes/config-example.json routes/config.json

### **Create config file (windows):** ###

copy "routes/config-example.json" "routes/config.json"

### **How to run:** ###

npm start

* NOTE: reload is not called on all pages *


### **Modify config file (Linux):** ###

vi routes/config.json

* Enter the information in the config file, save, and then quit *

* Note: another method below *

cat > routes/config.json

{
  "googleMapKey": "<Enter api key>",
  "api_host": "<enter api host>"
}
(control d)

### **Modify config file (GUI):** ###

Go in routes folder and you will find config-example.json file. You need to create a config.json file that will contain the api key 
to use google maps and the api to the store. You can follow to format below to enter information.

{
  "googleMapKey": "",
  "api_host": ""
}







