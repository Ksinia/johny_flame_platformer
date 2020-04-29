# Johny Flame game

Simple 2D platformer created to get familiar with [Phaser](https://phaser.io/).

[![Screenshot](https://user-images.githubusercontent.com/42918058/80053173-94c8fd80-851c-11ea-8dcb-f7e6932bbc70.png)](https://scrolling-platformer.netlify.app/)

## Prerequisites

You'll need [Node.js](https://nodejs.org/en/), [npm](https://www.npmjs.com/), and [Parcel](https://parceljs.org/) installed.

It is highly recommended to use [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to install Node.js and npm.

For Windows users there is [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows).

Install Node.js and `npm` with `nvm`:

```bash
nvm install node

nvm use node
```

Replace 'node' with 'latest' for `nvm-windows`.

Then install Parcel:

```bash
npm install -g parcel-bundler
```

## Getting Started

Clone this repository to your local machine:

```bash
git clone https://github.com/Ksinia/johny_flame_platformer.git
```

Go into your new project folder and install dependencies:

```bash
cd johny_flame_platformer
npm install
```

Start development server on [localhost:8000](http://localhost:8000/):

```
npm run start
```

To create a production build:

```
npm run build
```

Production files will be placed in the `dist` folder. Then upload those files to a web server.
