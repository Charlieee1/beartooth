# Beartooth
An attempt at a platformer.

## Try it in your browser!
Go to https://charlieee1.github.io/beartooth/pages/ in your browser to see the newest demo. No installation necessary.

## Installation Instructions
Install nodeJS, then run these commands:
```bash
git clone https://github.com/Charlieee1/beartooth.git
cd beartooth
npm install
npm run dev
```
Then go to http://localhost:1024/src in your browser.  
To build, run:
```bash
npm run build
```
To preview the build with vite, run:
```bash
npm run preview
```
Alternatively, build and preview at once:
```bash
npm run bp
```
To copy the /dist folder to /pages (for github pages deployment), run:
```bash
npm run pages
```

## TODO
This game is a work in progress. Here is my plan for next features:
- Scale rapier world down
- Crouching
- Pre calculating future frames
- Player position interpolation
- Wall jumping
- Camera position adjustments
- Grabbing & releasing
- Changing direction of grab
- Bumping
I want to add more after this, but I do not have a plan for anything further.
