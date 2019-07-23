# frontend-app
Frontend App build using react js

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## features added

**SignUp Page Validation**

validation has been added to the signup page with validation occuring on form submission, where each field is valided by a function tied to the respective field. 

Once all fields have been valided, if any errors have occured then the errors will appear below the their respective fields otherwise the signup api will then be called.

If the api returns a failed attempt then an error message will appear below the signup button otherwise the page will be render a message indicating that the signup was successful along with a link to the signIn page.