sequenceDiagram
participant browser
participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: JSON file containing {"message":"note created"}
    deactivate server

    Note right of browser: creates a new note, adds it to the notes list, rerenders the note list on the page and sends the new note to the server.
