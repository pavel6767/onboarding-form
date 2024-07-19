# Part 3
## If questions came from the database
Things to consider, if questions were being store in the database
- could add a couple of tables to the schema
  - questions (to store questions)
    - id: uuid
    - ...all the attributes currently in `onboarding.js`
  - answers (to store a user's answers)
    - composite PK of username and questions.id
    - body: string
- so the GET endpoint would query the questions table rather than hardcoded data

## Additional things
- Depending on the use case, we could also have a large set of questions and only expose certain subsets, depending on the user type
- in the longer term, also depending on use case, could have an admin panel
  - add functionality to add additional questions
  - manage which types of users receive which subset of questions
    - additional logic/migration would have to handle if a user type has been added to a new question that is required, to add a default value in the DB, but to prompt the user to answer next time they log in