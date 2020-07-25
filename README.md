# Minesweeper

Solution to the Amazon challenge by Deviget.

The challenge only requires an API, but I used to love minesweeper as a child, before I had internet, and this seems like a really fun challenge, so I decided to implement a frontend for it.

I'm not spending a lot of time in code quality or aesthetics in the frontend though, as it's just an extra and I'm pretty short on time. I decided to go with next due to the simplicity of the framework, and to skip TypeScript because the complexity is going to stay pretty low and I'm going to be working on my own on it. 🤠 Yee-haw!

## Plan

1. Implement everything in the frontend
1. Add backend
1. Move game logic to backend. Frontend will then be "blind" to the state of unknown cells, no Chrome Inspector cheating!
1. Add auth
1. Make client library. Using TypeScript, ideally.
1. Refactor frontend to use client library.

## Challenges

Minesweeper is a game with pretty simple mechanics. If you click on a mine, it's game over. If you find all mines, it's a win.

### Challenge 1: Recursion

The only challenging mechanic is triggered when you click on an empty cell: all surrounding empty cells must be cleared, and so on. This is simple recursion, the same used by the [Flood Fill](https://en.wikipedia.org/wiki/Flood_fill) of MS Paint and other simple paint programs. 

Luckily I've already implemented this in the past while developing game engines — flood fill is an useful tool when editting 2D top-down RPG maps. The hidden challenge in the recursion is an easily reachable stack overflow, which can be avoided controlling the max depth of recursive calls and storing temporary state in a list. 

In all likelyhood there are way more efficient solutions to this problem, but this one works pretty well. If the board is small the stack overflow may not even be a problem.

Doing this recursion server-side at scale would probably be a huge challenge, which would require research and experimentation. But we're not going for scalability right now.

### Challenge 2: Persistence

The other challenge is persisting the state of the game. The simplest approach is just storing the entire matrix in MongoDB. This is the approach I'm gonna follow in the challenge. 

A simple optimization on top of that would be serializing the matrix, storing 1 byte indicating the width, 1 for the height, and then 1 byte for each cell. You could even make it smaller by storing cell values in a nibble instead of a byte, using bit-wise operators, since there are only so few possible values for each cell. But this is an optimization, and we don't care about optimizations in code challenges or PoCs. We can literally run the most primitive implementation in the free tiers of Heroku, Mongo Atlas and Netlify / Vercel, and still scale up to tens or maybe even hundreds of concurrent users.

### Challenge 3: Auth

There are many ways to do auth these days. I'd love to implement Auth0, which is pretty simple and very powerful, if time allows. Otherwise, I may just go with email+password and a JWT.

## API

We are going to need a couple of endpoints. 

### GET /games

401 if auth not present or invalid.

200 + array of games "owned" by authenticated user otherwise. Since it's going to be a list of all games, avoid returning game cell state, which is the heaviest property. This is intended for rendering in a list of past and ongoing games.

### GET /games/:id

401 if auth not present or invalid.
403 if game not owned by authenticated user.
200 + game with cell data otherwise.

### POST /games

This is our "new game" endpoint.

The client is required to create and provide the ID of the game. A UUIDv4 will be used for this. 

400, 403 or 422 (Can't make my mind up) if a game with the provided `id` already exists.
201 otherwise.

#### Small Note on Client-Generated IDs

The industry standard up until not so long ago was for DB engines to create ids, so it's pretty common for people to feel alienated by client-generated ids.

Generating IDs on the client-side is a standard practice when following the CQRS / event sourcing philosophy. Mark Seemann wrote [a nice piece on this subject](https://blog.ploeh.dk/2014/08/11/cqs-versus-server-generated-ids/).

UUID collisions are possible, albeit unlikely. Astronomically unlikely, in theory. Here's [a cool read about generating UUIDs at scale, client side](https://medium.com/teads-engineering/generating-uuids-at-scale-on-the-web-2877f529d2a2). 



