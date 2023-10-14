# Quilt Labs - Notes - Russell Feathers

## Russell Documentation

### Implementation

<img src="./public/app.png" style="border-radius: 8px;">

### Usage Notes
  - Names editable from within items by double clicking
  - Multiple selection of items allowed through using shift

### Tricky Problems Faced

- Setting state to itemStack
  - Surprised that itemStack length grew as it went but when making updates I used the "last" object in the itemStack
  - Needed to make a deep copy each time.  This made sense because of react's state management but could be expensive on an intricate project
- Double Calling by React
  - To update the name I updated the setItemStack within a function called updateName.
  - Interestingly React rendering called the setItemStack function twice but only called the updateName function itself once
  - Set up booleans for the fileName outside the setItemStack function to avoid double error messages for duplicate names
  - One solution I saw was to turn off React Strict mode but didn't want to go that route

### Next Steps
- UI
  - clickable file Path
  - Better note input formatting
  - more metadata to files and directories
  - more error handling
  - multiple selection with ctrl
- Persistent Storage in database or locally to disk
  - NoSQL, RDBS database, or .json
- Data Types
  - unique id rather than relying on name. Didn't need that in my implementation but seemed like that could be helpful

### Any Additional Steps
- Runs the same as the steps below
- downloaded Material UI for formatting buttons


## Running the code

1. If you don’t have it please install [node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
2. Run `npm install` in the project directory.
3. Run `npm run dev` in the project directory.
4. The app should now be running on `localhost:3030` so put that into your web browser and try it out.


## Provided code

**Items**

An **Item** can be either a **Note** or a **Directory**. A **Note** is a leaf node in the filesystem and contains a string of text. A **Directory** is a node in the filesystem that can contain other **Items**. The root of the filesystem is a **Directory**.

Schema:

| **Field** | **Type**              | **Description**                                                                                       |
|-----------|-----------------------|-------------------------------------------------------------------------------------------------------|
| type      | ‘note’ \| ‘directory’ | Defines whether an Item is a Note or Directory.                                                       |
| name      | string                | The name associated with the Item.                                                                    |
| parent    | Item \| undefined     | A reference to the parent of this Item.   undefined for the `root` directory.                         |
| note      | string \| undefined   | The actual notes text that the user can set for `Note` items.   undefined when `type == ‘directory’`. |
| items     | Item[] \| undefined   | The items in this directory if the item is a `Directory`.   undefined when `type == ‘note’`.          |

This is defined in `app/components/types.ts`.

**Components**

* `ReactApp (app/components/reactApp.tsx)` - The main component that renders the app.
* `Workspace (app/components/workspace.tsx)` - The component that renders the filesystem.
  * This component provides a `React.Context` through which child components can filesystem methods and state.
* `ItemView (app/components/workspace.tsx)` - The component which renders an individual Item.
  * This component is checks the type and renders the correct component for the Item type (Note or Directory).
* `noteView (app/components/noteView.tsx)` - The component which renders a Note.
* `directoryView (app/components/directoryView.tsx)` - The component which renders a Directory.

**React Context**

The `Workspace` component provides a `React.Context` through which child components can filesystem methods and state. This is defined in `app/components/workspace.tsx`.

| **Field**      | **Type**     | **Description**                                                                            |
|----------------|--------------|--------------------------------------------------------------------------------------------|
| currentItem    | Item \| null | The current item rendered in the `Workspace`.                                              |
| itemStack      | Item[]       | An array of Directories which enclose the `currentItem`. You can think of this as a path.  |
| setCurrentItem | Function     | Sets the current item to a different item.                                                 |
| addNote        | Function     | Creates a new note given a `fileName` and `noteText`, if the `currentItem` is a directory. |
| addDirectory   | Function     | Creates a new directory given a `newDirName`, if the `currentItem` is a directory.         |
| updateNote     | Function     | Updates the `note` text of the `currentItem`, if it is a note.                             |

**Questions**

If there are any questions or issues about the starter code, please reach out to `support@quiltlabs.ai` and we will respond ASAP. Good luck!