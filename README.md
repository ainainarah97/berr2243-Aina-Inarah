# Week 4 Exercise: Use Case-Driven API Design & Implementation

## Objective
In this exercise, you'll learn about HTTP methods, status codes, and API design best practices. You will create a use case diagram to define the required APIs for a ride-hailing system, implement RESTful APIs in Node.js, and develop a new feature based on the design.

## Key Topics
1. Use Case Diagramming: Identify actors, use cases, and required APIs.
2. API Specification: Define RESTful endpoints, HTTP methods, and status codes.
3. Implementation: Build a new feature (e.g., user authentication) based on the design.

## Deliverables
1. Use case diagram and API specifications.
2. Node.js/Express implementation of the new feature.
3. Answers to design-focused questions.

## Lab Procedures

### Part 1: Use Case Diagram & API Specification

#### Task 1: Brainstorm Actors and Use Cases
Identify the actors and the use cases for the system:
- Actors (Example): Customer, Driver, Admin.
- Use Cases (Example):
  - Customer: Register, Login, View Profile.
  - Driver: Update Availability, View Earnings.
  - Admin: Block User, View System Analytics.

#### Task 2: Design the Use Case Diagram
Use diagramming tools such as [draw.io](https://www.draw.io) or [Lucidchart](https://www.lucidchart.com) to create the use case diagram. The diagram should represent the actors and their use cases.

#### Task 3: Define API Specifications
Translate use cases into RESTful endpoints. Example:

| Use Case              | Endpoint                | Method  | Status Codes                |
|-----------------------|-------------------------|---------|-----------------------------|
| Customer Registration | /users                  | POST    | 201 Created, 400 Bad Request|
| Customer Login        | /auth/login             | POST    | 200 OK, 401 Unauthorized   |
| Update Driver Status  | /drivers/{id}/status    | PATCH   | 200 OK, 404 Not Found      |
| Block User (Admin)    | /admin/users/{id}       | DELETE  | 204 No Content, 403 Forbidden |

### Part 2: Implement the RESTful APIs

#### Task 1: Develop the API
1. Continue from the last week's exercise and develop the API designed in the previous section. Use Node.js with Express for your API development.
   
2. Implement the necessary routes and handle HTTP methods as specified.

#### Task 2: The Data Model
1. Draft the data model required for your application based on the APIs you have designed. This model will include the structure for users, drivers, and admin actions.

## Submission Requirements

1. Use Case Diagram: 
   - Submit either an image file or a diagram link.

2. GitHub Repository: 
   - Include the complete code in your GitHub repository. Follow Git workflows and push all changes to GitHub.

3. Postman Collection: 
   - Export and include the Postman collection file for testing the APIs.
