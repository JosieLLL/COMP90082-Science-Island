

# Science Island Curriculum Mapping Project-COMP90082-2022-S1-SC-Redback


## Background 

Science Island is an online computer game that teaches kids about STEM. Science Technology Engineering and Mathematics are crucial to addressing the challenges the world is facing at the moment. Things such as climate change, population growth, health care and sustainable energy production. But STEM is also about creating new opportunities in areas like ubiquitous computing, the internet of things, genetics, nanotechnology, artificial intelligence and driverless cars, to mention just a few. Science Island was specifically developed for children who are 10 to 12 years of age and it aims to teach STEM in a new way. Being design-led, it focusses on having fun, with cool content that kids actually want to engage with. The objective of the of the game is to repair Science Island which is a 100 year old dilapidated theme park. The player collects tokens by watching animations, playing games doing quizzes and experiments, and uses these to fix and unlock rides. There 10 separate worlds which contain over 120 quests the payers to complete. A press release and more information can be found here: http://www.scienceisland.com/press/#/ A beta version of the game is online here: www.scienceisland.com



## Project Overview

The project is led by an academic researcher working at the Swinburn University of Technology. The concept of the project is to deliver STEM learning materials to children over the world in an interesting and fun way that could consistently attract students to keep learning the knowledge and interacting with the online content.

There are two existing parts of Science Island currently in operation, Game and Teacher Portal. We are required to develop some new functionalities on the basis of the Teacher Portal which is a student management system mainly focusing on user registration, group formation, and assignment management including creating and tracking.

### A new curriculum mapping system

The new set of requirements from the client involves developing a new system separately from the Teacher Portal. A limited group of people, such as an experienced teacher or a curriculum design professional, are enabled to map the activities (quiz, book, song, animation, game, etc.) of each teaching topic of Science Island to the Australian F-10 Curriculum in this system. After the mapping results are completed, students' parents, or other teacher users, could see their achievements within the Australian Curriculum framework in the Teacher Portal after completing those activities.

### Assignment section extension in Teacher Portal

A functional extension in the Assignment section in the Teach Portal has also been briefed, asking us to integrate the Assignment section with the mapping results from the mapping system. The users of the Teacher Portal should directly see the results when creating assignments by choosing/filtering the activities.

More details are in [Project Specification](https://confluence.cis.unimelb.edu.au:8443/download/attachments/87074545/Curriculum Mapper Brief 2022.pdf?version=1&modificationDate=1647909920819&api=v2)

### In-Scope Features

#### *New Curriculum Mapping System*

- A login mechanism enables the authorized people to have the access of the system
- A new view/section enables the user to have a bird's view of all activities
- A mapping section to assign each category of the Australian F-10 Curriculum, such as Subject, Strand, Substrand, Code, Year Level, etc. to the corresponding activities
- The mapping process should comply with the Australian F-10 Curriculum structure
- One activity should be assigned to multiple categories (tags) of the same hierarchical level of the Australian F-10 Curriculum structure
- A mapped activity section for the user to browse all the activities that have been mapped
- An unmapped activity section for the user to browse all the activities that have not been mapped
- The system should be able to be connected back to the Teacher Portal

#### *Assignment Section in Teacher Portal*

- A new or several filtering functions based on the Australian F-10 Curriculum should be created
- The user should see all the Australian F-10 Curriculum tags on each activity when creating an assignment



### Out-Scope Features

#### *New Curriculum Mapping System*

- The international curriculum (International Baccalaureate, Chinese, USA, UK) mapping should be considered in this system in the future, whereas the Australian Curriculum mapping is the main focus at the moment.



### Constraint

- Australian F-10 Curriculum website API
  - There is machine-readable content from the Australian Curriculum website for developers to crawl data. However, it's not a dynamic API. A timer has been set at the backend to detect and update any newer data to our system at 1 am every month.

### Technical Stacks

- Front-ended: React + TypeScript
- Back-ended: Go Gin
- Database: AWS + MySQL



## Version Control

### GitHub Structure

├── .husky            # Git hook tool used for commit management

├── data samples/   # Documents you need to generate with all the data (inputs) necessary to simulate/demonstrate your prototype (whatever can be provided as an input in your prototype) 

├── docs/          # Documentation files (you can create subfolders here to organize your requirements and meeting minutes)

├── prototypes/low fidelity/   # low fidelity files (screens, mockups and so on)

├── prototypes/high fidelity/   # high fidelity files (screens, source files and so on)

├── src/            # src code

├── tests/          # User/system tests

├── ui/            # All the images created for the prototypes (icons, fonts, backgrounds... should be here. This is different from the prototypes' folders. These are the graphical elements that goes into the prototypes)

├── commitlint.config.js          # Commitlint config file

├── package.json          # Node package management file

├── package-lock.json          # Node package management file

└── README.md



### [Version Control Manual](./docs/GithubUsageSpec.md)

See link↑



## Development Environment Setup

### Repo Level

​	Purpose: Install dependencies for repository level commit message validation. 

1. Install **Node.js** (Skip this step if you have already installed it).
2. Install dependencies with `npm install`

### Backend

1. Install **go**, **redis**, **mysql** (Skip this step if you have already installed it).

2. `cd ./src/backend/services`

3. Config required information in `local.env`

4. Run main.go

5. The backend server is now located at [localhost:8088](http://localhost:8088)

### Frontend

1. Install **Node.js** (Skip this step if you have already installed it).

2. `cd ./src/frontend/`

3. Install dependencies with `npm install`

4. Start the server with `npm start`

5. The frontend server is now located at [localhost:3000](http://localhost:3000)

   

## API documentation

The backend API documentation is [here](./docs/API%20Doument.pdf).



## Deployment

This project is deployed by `docker`. Please install `docker` and `docker-compose` before proceeding.

### Frontend

Change the directory to `./src` and run the following command in the terminal:

`docker-compose up -d --build frontend`

### Backend

Change the directory to `./src/backend` and run the following command in the terminal:

`docker build -t backend .`

`docker run -d -p 8088:8088 backend`



## Change Log

This project automatically generates change logs, and only those commit records whose commit messages are marked as feat and fix will be generated. 

See this link for the type definition criteria for the commit message: [AnguarJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.4e0o8t4fffjf)

### 	Generation command

​		Initial generate： **npm run changelog-init** 



## Additional Info

[Confluence](https://confluence.cis.unimelb.edu.au:8443/pages/viewpage.action?pageId=87067710)

[Jira](https://jira.cis.unimelb.edu.au:8444/secure/RapidBoard.jspa?rapidView=401&projectKey=COMP900822022SM1SC&view=planning.nodetail&issueLimit=100)

[Github](https://github.com/COMP90082SM12022/SC-Redback)  

