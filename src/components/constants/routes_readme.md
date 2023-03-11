# Using Routes.js for Storing Page Endpoints

The `Routes.js` file in the `/src/components/constants/` directory contains constants for storing the endpoints of various pages in the project. These constants can be imported and used throughout the project to navigate between pages.

## Creating a New Route
To create a new route for a page you've created, follow the steps bellow:

1. Create a new constant in `Routes.js`. For example, the following code is how you would create a new route for the resources page.

    ```
    export const RESOURCES_PAGE = "/resources";
    ```

2. Import the new constant from `Routes.js` to `App.js`:
    ```
    import {
        <other constants>
        RESOURCES_PAGE
    } from "./constants/Routes";
    ```

3. Next, use the constant to define the route in `App.js`:
    ```
    <PrivateRoute path={RESOURCES_PAGE} component={ResourcesPage} />
    ```

## Using the New Route for Redirects
In the case that you need to use the route as a redirect (for example, after creating a resource, you're redirected to the resources page), do the following:
1. Import the constants you need from `Routes.js` into your component:
    ```
    import {
        RESOURCES_PAGE
    } from "./constants/Routes";
    ```
    Note: other constants can be added here if needed. Please do not add any unsused constants.

2. Use the constants to navigate to the desired page. For example, to navigate to the resources page, you can use the `RESOURCES_PAGE` constant as follows:
    ```
    <Link to={RESOURCES_PAGE}>Back to Resources</Link>
    ```
    Make sure to use the curly braces (`{}`) when referencing the constants, as they are JavaScript variables and need to be evaluated as such. This only applies to the return statements, and the variables should be referenced without the braces in regular code. 

    
