# to-duties

## Setup

Install the dependencies, set up the proper .env-files and start the server https://github.com/MadaPas/ToDuties_server
```
$ cd server
$ npm install
$ npm start
```
Install the dependencies, and start the client https://github.com/MadaPas/ToDuties_client
```
$ cd client
$ npm install
$ npm start
```

### Technical Requirements

  ● Language: TypeScript
  
  ● Framework: React
  
  ● Backend: Node

## features
●  ⚠ (required): I as a user can create to●do items, such as a grocery list

●  I as a user can mark to-do items as “done” - so that I can avoid clutter and focus on things that are still pending

●   as a user can filter the to-do list and view items that were marked as done - so that I can retrospect on my prior progress

●  I as a user can add sub-tasks to my to-do items - so that I could make logical groups of tasks and see their overall progress 

●  I as a user can specify the cost/price for a task or a subtask - so that I can track my expenses / project cost

●  I as a user can see the sum of the subtasks aggregated in the parent task - so that in my shopping list I can see what contributes to the overall sum. For example, I can have a task “Salad”, where I'd add all ingredients as sub-tasks, and would see how much does a salad cost on my shopping list

●  I as a user can add sub-descriptions of tasks in Markdown and view them as rich-text while I'm not editing the descriptions


●  I as a user can create multiple to-do lists where each list has it's unique URL that I can share with my friends - so that I could have separate to-do lists for my groceries and work-related tasks

●  In addition to regular to-do tasks, I as a user can add “special” typed to-do items, that willhave custom style and some required fields:

    - ”work-task”, which has a required field “deadline” - which is a date
    - “food” that has fields:
        - required: “carbohydrate”, “fat”, “protein” (each specified in g/100g)
        - optional: “picture” an URL to an image used to render this item

●  I as a user can keep editing the list even when I lose internet connection, and can expect it to sync up with BE as I regain connection

●  I as a user can be sure that my todos will be persisted so that important information is not lost when server restarts


#### Still under development features:

●  ⚠ (required): I as ​another user ​can collaborate in real-time with ​user ​- so that we can (for example) edit our family shopping-list together

● I as a user can make infinite nested levels of subtasks



