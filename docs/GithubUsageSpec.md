# Team SC-Redback Github Team Collaboration Specification 



[TOC]

## GitHub Repo

[Link](https://github.com/COMP90082SM12022/SC-Redback)

## Branch Structure

***main***

​		Main branch, the final, stable, tested, bug-free branch that can be deployed in production.

***dev***

​		Branch used during development, always with the latest version, serves as the baseline branch for *developer* and *release* branches.

***developer***/

​		Branch of each developer on the team. Naming convention: **developer/NAME**

***release/***

​		This branch is based on the *dev* branch for testing and fixing prior to release.  Merge into the *main* branch and synchronize the *dev* branch after all issues are resolved. Naming convention: **release/NAME**

***hotfix/***

​		Branch used for emergency fixes for online bugs. Take the *main* branch as the baseline and merge it into the *main* and *dev* branches once the repair is complete. Naming convention: **hotfix/NAME**

  



## Commit Message Standard 

[AnguarJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.4e0o8t4fffjf)
