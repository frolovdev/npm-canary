npm i @easymoney/money@0.13.0-rc.0

1) start ci
2) we need to store packages versions in some json object, called VersionObject
3) from VersionObject we understand is it need to update versions (we look to npm try to find version of package) 
4) if not exist in npm we create rc
5) we publish rc
6) with docker container we download rc copy tests and run on package
7) if its ok we publush prod version