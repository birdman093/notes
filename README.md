# Quilt Labs - Notes - Russell Feathers

## Russell Documentation

### Implementation

<img src="./public/app.png" style="border-radius: 8px;">

### Usage Notes
  - Add new notes, directories
  - Delete items by selection
  - Edit item names of current item by double clicking fileName located below 'Path' and 'Previous Directory'
  - Select multiple items simultaneously using shift key
  - Navigate backwards using Previous Directory button and through clicking directories in 'Path' at top

### Tricky Problems Faced

- Deepcopy of itemStack
  - itemStack length grew as it went but when making updates I used needed the "last" object in the itemStack
  - Made a deep copy before each change to ensure React's state immutability principle, but could be expensive on an intricate project
- Double invocation of state update functions
  - To update filenames, I used the setItemStack state update function within updateName.
  - setItemStack was invocated twice but the updateName function itself was only called once
  - Some suggestions were to turn off React strict mode, but decided on the below solution
  - Utilized booleans to display alerts for duplicate file name outside the setItemStack function to avoid double alert messages being displayed twice during the setItemStack invocation

### Next Steps
- UI/UX
  - Implement rich text editing for enhanced note input and display
  - Add Metadata attributes to items, such as date created, date modified, previews
  - Expand error handling (limiting character types?)
  - Filte, sort, search
- Web Service 
  - Implement persistent storage in NoSQL database or by saving locally to formats like .json, .txt
- Data Types
  - Assign Unique ids to each item for more robust data handling, rather than solely relying on names. This was not a requirement in this design but coudl be beneficaial with more intricate data management.
- Browser/ Mobile Testing
  - The application was primarily tested on Safari and Chrome browsers on a MacBook

### Additional Run Steps
- Runs per below
- Downloaded Material UI for Buttons (in package.json)

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