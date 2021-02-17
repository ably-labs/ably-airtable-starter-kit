This branch is a WIP implementing Hive AI powered profanity filter in the chat.


### A fully functional starter kit to store realtime messages from Ably into Airtable via WebHooks

This project shows how to use [Airtable](https://airtable.com/) to store realtime messages using a group chat app built with [Ably Realtime](https://www.ably.io/). 

<img width="1435" alt="Demo home screen" src="https://user-images.githubusercontent.com/5900152/100996623-2e479b80-3551-11eb-8fbb-336dc45d8679.png">

The resulting demo app shows two sections. While one section shows the fully functional live group chat app, the other section shows a play-by-play description of various things happening behind the scenes in each step, along with code snippets to implement that piece of functionality. 

For example, it shows when the connection with Ably is successfully set up, when and how many messages were retrieved from the Airtable database, or the live messages pushed by Ably, etc.

<img width="1430" alt="Demo chat screen" src="https://user-images.githubusercontent.com/5900152/100996614-2ab41480-3551-11eb-8cd8-dfec99c73756.png">

Any new messages posted to the chat go through a profanity filter, and get automatically published to [Airtable's REST API](https://airtable.com/api) as well via [Ably's WebHooks integration](https://www.ably.io/integrations).

---

## Live demo

Check out this project in action at https://realtime-chat-storage.ably.dev/

## How to run this project locally?

1. Clone this repo using:

```
git clone https://github.com/ably-labs/ably-airtable-starter-kit
```

2. Change directories into the project using:

```
cd ably-airtable-starter-kit
```

3. Create a new file called `.env` and add the following:

```
ABLY_API_KEY=<YOUR-ABLY-API-KEY>
```

4. [Sign up for a free account with Ably](https://www.ably.io/) to get your API Key and replace the placeholder `<YOUR-ABLY-API-KEY>` in step 3 with your Ably API Key.

5. Install both the NodeJS server and front-end VueJS app dependencies using:

```
npm install
cd ably-airtable-storage
npm install
cd ..
```

6. Run the server using `node server.js` and open the app in your browser at `http://localhost:8082/`


## The tech stack

##### Frameworks/ Languages

- [Vue JS](https://vuejs.org/)
- [Node JS](https://nodejs.org/en/)

##### Libraries

- [Airtable SDK](https://airtable.com/api)
- [Ably Realtime](https://ably.io/)
- [Express](https://expressjs.com/)
- [Axios](https://www.npmjs.com/package/axios)
- [Bootstrap](https://getbootstrap.com/)
- [DotEnv](https://www.npmjs.com/package/dotenv)
- [vue-code-highlight](https://www.npmjs.com/package/vue-code-highlight)

## Learn more about the project

Check out my detailed blog post (coming soon...) to understand this project in detail along with ways of extending this project to use other databases or even get realtime updates from Airtable.

## Load tests and limits

- All of Ably's messaging limits, broken down by package can be found in a [support article](https://support.ably.com/support/solutions/articles/3000053845-do-you-have-any-connection-message-rate-or-other-limits-on-accounts-).

- As of this writing Airtable's public API has a [rate limit of 5 requests per second, per base](https://support.airtable.com/hc/en-us/articles/203313985-Public-REST-API). 

- We are currently performing load and performance tests on this starter kit and will update this guide with that info when it's available. If this is important to you, please [leave a message to me directly on Twitter](https://www.twitter.com/Srushtika) or reach out to Ably's support team at [support@ably.com](mailto:support@ably.com)
