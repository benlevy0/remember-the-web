# remember-the-web

1. Download the Anki app and run it locally.
2. Install the AnkiConnect plugin: https://ankiweb.net/shared/info/2055492159
3. Create a new deck in Anki that you'd like to put the flashcards into.
4. Load the `chrome-extension` folder into Chrome as an unpacked extension.
5. Clone this repo, set up the .env, and run the `server` folder locally via `bun install` and `bun run start`.
6. On Mac, highlight and use command-shift-Y to create a flashcard.

Set up a `.env` file with the following variables within the `server` folder:

```
OPENAI_API_KEY=
ANKI_DECK_NAME=
```
