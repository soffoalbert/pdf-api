# The PDF API Server

## Introduction

The pdf-api server is an express based, backend application backed by Nodejs and Typescript. Its purpose is to serve as an application powering frontend applications which have an objective 
to process and download PDFs or any kind of file.     
 

## Interfaces

##### PDF handler interface
This interface serves as an API for receiving, storing and then publishing PDF processing requests, to the message broker(Redis).
the requests would originate from the client application that would like to process PDF or file URLs asynchronous and getting notified once done.  

##### PDF processor interface

This interface serves as an API for reading requests from the message broker, extracting the file url, downloading the file to the server and then notifying the client application 
in an event (using socket.io). this assuming the client application would be a web or mobile application.

## Test

##### Unit test

These tests are there to test the different set of APIs in isolation, so that their behavior could be predictable.  

##### Integration test

These tests are there to test the different set of APIs but this time not in isolation but rather with an actual running instance of the application.

## Error Codes

500 - Something unexpected occurred(Ideally this should not occur or at least not be shown to the user) 
400 - When the URLs has already being processed.
201 - When the PDF or file processing request has being stored and submitted to the message broker.
200 - When the request to fetch all PDF s data from the database.

## Technologies used
- **NodeJS**: to execute javascript on the backend
- **Typescript**: to benefit from its static typing.
- **Express**: for its middleware framework and much more.
- **Inversify**: for dependency injection which simplifies unit testing.
- **Typeorm**: for its Object Relational mapping capabilities.
- **Jest**: for unit and integration testing 
- **Redis**: as the message broker
- **Socket IO**: for notifying the client that a PDF processing request is completed.

## How to run the Application

- `npm install` 
- `npm run start`

## How to run the Tests

`npm run test`

## Improvements
- The integration tests are a bit flaky
- Fix the PDF processor unit tests 





