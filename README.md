How to Use Google Search Console API in Node.js
===============================================

In this post, you will learn how to access your Google Search Console property data from Node.js.

By the end of this tutorial, you will query data via Search Console API and retrieve your top 10 most clicked pages.

To get there, you will:

1.  Set up a project on Google Cloud Platform.
2.  Enable the Search Console API.
3.  Create a service account.
4.  Create credentials.
5.  Add the service account as a user to your Search Console property.
6.  Authenticate your Node.js client and query data.

[Prerequisites](#prerequisites)
-------------------------------

Before you start, let’s get the obvious out of the way. You need to have a Google Account that has full access to a property registered on Search Console.

Now that you’ve got that covered, let’s go ahead and start setting everything up.

[Google Cloud Platform Project Setup](#google-cloud-platform-project-setup)
---------------------------------------------------------------------------

Before you start doing anything, you need to create a project on [Google Cloud Platform](https://console.cloud.google.com). Either make sure you have one already available or make a new one. [Here’s a guide by Google](https://developers.google.com/workspace/guides/create-project) for creating a new project.

There are a few more things you need to set up on Google Cloud Platform. For a start, you have to enable Search Console API.

### [Enabling Search Console API](#enabling-search-console-api)

To enable the Search Console API for your project, open your [Google Cloud Console](https://console.cloud.google.com). Make sure you have selected your project next to the search bar on the left.

Now type in the search bar “google search console api” and hit enter. The first result should be **Google Search Console API**. Click on it and enable it.

Alternatively, you can follow these steps to find and enable Search Console API:

1.  Click on the **☰** hamburger navigation menu in the top left corner.
2.  Hover over **APIs & Services** menu item on the left side.
3.  Click **Library**.
4.  Type “search console” in the search input inside the API Library and hit enter.
5.  Select Google Search Console API from the results.
6.  Click the **enable** button.

The next step is to create a service account.

### [Setting up a Service Account](#setting-up-a-service-account)

A service account is a special kind of account that represents a non-human user. Such account is necessary to authenticate and authorize your application to access Google APIs.

Your Node.js application uses a service account to access your Search Console data.

Just like before, open [Google Cloud Console](https://console.cloud.google.com/) and make sure you’ve selected your project. Then, search for “service accounts” at the top. You should see **Service Accounts** as the first result. Select that.

Or, follow these steps to navigate to Service Account section:

1.  Click on the **☰** hamburger navigation menu in the top left corner.
2.  Hover over **IAM & Admin** in the sidebar on the left.
3.  Click **Service Accounts**.

Now you should create a new account by following these steps:

1.  Click **create service account** button at the top.
2.  Give your account a name
3.  Click **Done**.

Optionally, you can adjust the role of the account, but you should be fine skipping it.

When that’s done, don’t go anywhere. It’s time to create credentials for your service account.

### [Creating Credentials](#creating-credentials)

While in the **Service Accounts** section, go ahead and create a new key pair.

Follow these steps to add a new key pair:

1.  Select the service account by clicking on its email address.
2.  Click **Keys > Add keys > Create new key**.
3.  Choose **JSON** key type and click **Create.**

After doing this, you should see a file downloading to your computer. This file contains a private key, an email and other details. You will use these details to authenticate your app and access your Search Console data.

[Adding Service Account to Search Console](#adding-service-account-to-search-console)
-------------------------------------------------------------------------------------

The last step before coding is adding the service account as a user to your Search Console property.

Open your property on [Search Console](https://search.google.com/search-console) and do the following:

1.  Click on **Settings** in the left sidebar.
2.  Click on **Users and permissions** under General settings.
3.  Click **Add User** in the top right corner.
4.  Enter your service account’s email address inside the modal and choose a permission.

If you just want to query data, you should be fine setting the permission to “Restricted”. If you are planning to add or delete data, you should choose “Owner” instead. You can come back any time and adjust the permission level.

The setup is now done and you are finally ready to code.

[Authenticating Node.js Client](#authenticating-nodejs-client)
--------------------------------------------------------------

Before you can start using the API, you need to authenticate an API client instance inside your Node.js app.

Start by installing the [Search Console submodule](https://www.npmjs.com/package/@googleapis/searchconsole) package. Although you can use the full [Google APIs Node.js Client](https://www.npmjs.com/package/googleapis) library, using just the submodule can increase performance.

Run the installation command.

    npm i @googleapis/searchconsole
    

You will be using [dotenv](https://github.com/motdotla/dotenv#readme) package to load your credentials from an environment file.

You can authenticate your client by using the entire `.json` credentials file. But, it can be difficult to get that credentials file on your deployed application. Because you should never commit credentials to version control.

Hosting service providers allow you to specify environment variables. So, using environment variables can be much easier.

Run the command to install the dotenv package.

    npm i dotenv
    

Now do the following to set up an environment file:

1.  Create a `.env` file in the root folder of your project.
2.  Open the JSON file you got after creating keys for your service account.
3.  Copy the contents of `client_email` and `private_key` properties and place them inside the `.env` file. Do not copy the quotation marks, just the value between.

    CLIENT_EMAIL=service-account-name@project-id.iam.gserviceaccount.com
    PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nA LOT OF GIBBERISH\n-----END PRIVATE KEY-----\n
    

Finally, here comes the code. Go ahead and set up the authentication.

    require('dotenv').config();
    const searchConsole = require('@googleapis/searchconsole');
    
    const auth = new searchConsole.auth.GoogleAuth({
      credentials: {
        private_key: process.env.PRIVATE_KEY.replaceAll('\\n', '\n'),
        client_email: process.env.CLIENT_EMAIL,
      },
      scopes: [
        'https://www.googleapis.com/auth/webmasters.readonly',
      ],
    });
    

You have to substitute the `\n` characters inside your private key with actual line breaks. The `replaceAll` method returns the private key with all `\n` character instances replaced with line breaks.

If you are going to only read data from the API, you can leave `scopes` as is. But, if you are planning on adding or deleting data, you should remove the `.readonly` part.

      scopes: [
        'https://www.googleapis.com/auth/webmasters',
      ],
    

Lastly, create an authenticated client instance.

    const client = searchConsole.searchconsole({
      version: 'v1',
      auth,
    });
    

You are now ready to interact with the Google Search Console API.

[Fetching Data](#fetching-data)
-------------------------------

Start simple and perform a basic Search Analytics query to see if you’ve set everything up correctly.

    client.searchanalytics
      .query({
        siteUrl: 'https://your-website.com',
        startDate: '2022-01-01',
        endDate: '2022-12-31',
      })
      .then(response => console.log(response.data))
      .catch(reason => console.log(reason));
    

The `siteUrl`, `startDate` and `endDate` properties are required. Note that you must specify both dates in YYYY-MM-DD format.

You should see some data about `clicks` and `impressions` printed in your console.

Adjust your code to query your top 10 pages by clicks between 2022-01-01 and current date.

    client.searchanalytics
      .query({
        siteUrl: 'https://your-website.com',
        startDate: '2022-01-01',
        endDate: new Date().toLocaleDateString('en-CA'),
        dimensions: ['page'],
        rowLimit: 10,
      })
      .then(response => console.log(response.data))
      .catch(reason => console.log(reason));
    

Use `toLocaleDateString` method to format the date to a locale given in the argument. In this case, `en-CA` locale works great, because it formats `new Date()` to YYYY-MM-DD.

You are all set to use the Search Console API. Check out the official [API Reference](https://developers.google.com/webmaster-tools/v1/api_reference_index) to see what else you can do.

[Summary](#summary)
-------------------

You set up a project on Google Cloud Platform with Google Search Console API enabled. You then created a service account, created credentials for it and added it as a user to your Search Console. Finally, you authenticated your Node.js application and queried data with Search Console API.
