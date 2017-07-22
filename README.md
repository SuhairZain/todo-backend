# Approach
1. Use express to run the server and provide the routes.
2. Use MongoDB as the database, with Mongoose to help with the operations.
3. Use appropriate REST methods for the different operations.
4. The todos are saved under a user object, as an array. This was done to facilitate reordering.
5. The UUID module is used to generate unique IDs for the todos. This was done because Mongoose wasn't returning the ID for the last added todo.
