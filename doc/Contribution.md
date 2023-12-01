# Contribution

## Commit Messages

Use the following format:

```
[type]: present tense verb with what
```

`type` can be:

- `feat`: anything related to feature - adding features or enhancing existing features
- `bug`: anything related to bug fixes
- `refactor`: any code changes that do not result in any change in behaviour
- `doc`: self explanatory, generally any changes to md files, diagrams
- `chore`: anything that does not fall under any of the categories above

Be more specific in the "what":
Instead of

```
doc: update README
```

Do

```
doc: update README to include section about features
```

## Convention

We follow the standard convention [here](https://www.w3schools.com/js/js_conventions.asp).

- PascalCase for file names and component names
- camelCase for variable names
- currently we do not have a document for coding standards, but try to follow industrial practices as much as possible. Eg. there should not be any magic numbers, replace it with a ALL_CAPS constant variable etc.

Currently, the code base does not fully follow the convention and standards, so feel free to help correct them bit by bit.

## Formatting

Download `Prettier` VSCode extension.
