# SELU Assignment

#### CircleCI build page:

https://circleci.com/gh/dbousamra/selu-assignment/

#### Heroku deployment:

http://selu-assignment.herokuapp.com/


### API:

#### Create a user

*URL*: ```POST /user``` 

*Accepts*: ```email```, ```password```, ```firstname```, ```lastname```

*Returns*: ID of created user.

*Example*: 
```shell
curl -i -H "Content-Type: application/json;" -X POST -d '{ "email": "email@gmail.com", "password": "password", "firstname": "Dominic", "lastname": "Bou-Samra" }' http://selu-assignment.herokuapp.com/user
```

*Example response*: ```{ "id":"537019eafff8ea0b0060242e" }```

#### Login a user

*URL*: ```POST /user/login``` 

*Accepts*: ```email```, ```password```

*Returns*: JWT access token

*Example*: 
```shell
curl -i -H "Content-Type: application/json;" -X POST -d '{ "email": "email@gmail.com", "password": "password" }' http://selu-assignment.herokuapp.com/user/login
```

*Example response*: ```{ "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRvbUBkb20uY29tIn0.KJVs7TRNBgmrPZ4j3OpQbN-iTXkTmEGNPjBxGZqS0GE" }```

#### Update a user

*URL*: ```PUT /user``` 

*Accepts*: ```firstname```, ```lastname```

*Returns*: ID of updated user

*Example*: 
```shell
curl -i -H "Content-Type: application/json;" -H Authorization:'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRvbUBkb20uY29tIn0.KJVs7TRNBgmrPZ4j3OpQbN-iTXkTmEGNPjBxGZqS0GE' -X PUT -d '{ "firstname":"Dominic", "lastname":"Bou-Smara" }' http://selu-assignment.herokuapp.com/user
```

*Example response*: ```{ "id":"537019eafff8ea0b0060242e" }```


Architecture and Design:
========================

### Technologies:

- ExpressJS 4.0
- MongoDB with MongooseJS as the ODM
- PassportJS for authentication and authorization.
- Mocha and should.js for tests.
- Supertest for HTTP/controller tests

##### ExpressJS

Community support as the defacto web framework for NodeJS. It's mature and stable with lots of great documentation, and lots of third party plugins. Choosing another less mainstream framework more tailored to a specific task (eg Restify) is a difficult decision. One must weigh up the benefits given from the framework, versus the risk associated with a smaller more specialized tool. If that framework loses critical support within the community, the maintainers move onto other things etc, it can be a challenge for people using it. In this case ExpressJS can accomplish everything the other frameworks can, just slightly more verbosely.

##### PassportJS

PassportJS was chosen because it allows simple middleware to be written to handle authentication and authorization. It has the concept of "Strategies", which are essentially objects with a few functions that tell Passport how to authenticate and authorize a route. I elected to use Passport because it has out of the box support for many auth strategies, including OAuth1/2, and would require minimal code change to allow that.

### Testing:

All code was TDD'ed. I elected not to use any mocks, instead testing the database itself (using a test instance). The app is so small the speed gain from mocking would be negligible, and I feel it's always better to use real instances over mocked variants. The server was tested using Supertest by firing up a test server and calling the routes themselves. 

### Continuous delivery:

I used CircleCI (https://circleci.com/gh/dbousamra/selu-assignment/) to handle building, running tests and deploying to Heroku. It uses the circle.yml file present in the root directory. It runs all tests and if successful, deploys directly to the Heroku staging server. It also handles branch builds perfectly (i.e. I push a remote branch to Github, and it is automatically built and tested), so you never have untested code hanging around.

### Folder layout:

```app```: Contains models and routes for each domain object (in this case, just the User)

```config```: Contains configuration files that control the database selection, as well as Passport auth middleware.

```test```: Contains tests of the app code. Folder structure is identical to app.

### Authentication:

I considered many options when designing the authentication layer. I will outline some typical proposed solutions to REST based authentication:

##### HTTP basic auth: 

This method relies on sending the username and password with each request via the Authorization header. Generally they are encoded in base64 (to pad length), however they are still plain text readable. 

##### HTTP cookie based auth: 

###### How it works:

1. Client sends the username and password once, to an authorization route (user/login). 
2. The server will verify the user, and set a session variable containing user data. 
3. The server will then encode that session ID as a cookie, and send it to the client via the Set-Cookie HTTP header.
4. The client will then send the cookie on every request.

This method is established, and has been in use for many years. It does however have many problems:

- Cross domain requests take some work with CORS and won't work in most browsers. Must originate from same domain as per same-origin security policy.
- Not stateless. REST is by definition, meant to be entirely stateless. Server MUST retain the state of the user in a session. If the server goes down, that auth session is lost. This statefulness also makes it very difficult to scale servers horizontally, as you have no idea which server the session is located on. 
- Cookies are painful to deal with mobile API's. They are primarily a browser construct, not a HTTP construct.

##### JWT (JSON Web token) based authentication:

###### How it works:

1. Client sends the username and password once, to an authorization route (user/login). 
2. The server will verify the user and encode the users details in a JWT hash with a secret token known only to the server.
3. The server will then send that to the client in the JSON response.
4. The client will then send this token with every request under the ```'Authorization'``` header.

This method solves many of the problems with cookie based auth.

- Cross domain works easily, as it's just an HTTP header. It's not subject to any CORS policies.
- 100% stateless. Each token represents the entire user (or some way to fetch a user from the DB - perhaps an ID or email), and doesn't rely on anything else besides knowing the session secret. This means its extremely easy to scale horizontally by adding more servers because each server can handle a different authorized request, and successfully decode a user.
- JWT is just JSON. It is easy to consume as a client.


I elected to implement a token based authentication method. I used the PassportJS Bearer strategy, and have methods to encode and decode a user. Protecting an API endpoint is made simple because I can just plug a authentication middleware instance into a route like so:

```javascript
router.get('/user', passport.ensureAuthenticated, function(req, res, next) {
  // do secure logic here.
});
```

#### Problems:

There are a few problems with my implementation, however none are severe.

- All traffic should 100% be over HTTPS, however I have no SSL implementation. I elected to keep it simple for now, however adding SSL is easy, and can be done at a later date. I didn't do so because the hassle of getting a certificate set up etc.
