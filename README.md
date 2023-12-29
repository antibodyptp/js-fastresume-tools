# js-qb-fastresume-tools

```
        ____     __           _                                        _              _
   __ _| __ )   / _| __ _ ___| |_ _ __ ___  ___ _   _ _ __ ___   ___  | |_ ___   ___ | |___
  / _` |  _ \  | |_ / _` / __| __| '__/ _ \/ __| | | | '_ ` _ \ / _ \ | __/ _ \ / _ \| / __|
 | (_| | |_) | |  _| (_| \__ \ |_| | |  __/\__ \ |_| | | | | | |  __/ | || (_) | (_) | \__ \
  \__, |____/  |_|  \__,_|___/\__|_|  \___||___/\__,_|_| |_| |_|\___|  \__\___/ \___/|_|___/
     |_|
```

Tools for editing qBittorrent fastresume data.

## Features
<span style="color: red">NOTE: currently these tools only support the experimental SQLite database, I plan on adding support for .fastresume files in the future.</span>

With these tools you can:
- Bulk edit save paths for existing torrents (without having to recheck)
  - Note, since "/" separators are compatible on Windows, this uses them for all paths regardless of OS
- Bulk edit tracker announce URLs

<br>
More functionality may be added in the future.

## Arguments
 - `-f, --database-file` - File path for the torrents.db file
 - `--disable-backup` - disables automatic resumedata backup
 - `--existing-path` - The existing save path (or segment of a path)
 - `--new-path` - New path or segment to replace existing one
 - `--existing-tracker` - The existing tracker URL (or segment of a URL)
 - `--new-tracker` - New tracker or segment to replace existing one

## Getting Started
Install packages:
```bash
npm i --omit=dev
```

Build:
```bash
npm run build
```

Run the script with:
```bash
node ./dist
```

## Examples and Usage
### Path editing example
Scenario: fifteen movies are currently seeding from the `D:\downloads\movies` directory on Windows and you'd like to migrate to Linux using a path at `/torrents/movies`.
```bash
node ./dist --existing-path "D:\downloads" --new-path "/torrents"
```
<br>

### Tracker editing example
Scenario: The existing tracker on several torrents is currently `http://some-tracker.com:6969` and you'd like to change to the https tracker on a different port.
```bash
node ./dist --existing-tracker "http://some-tracker.com:6969" --new-tracker "https://some-tracker.com:5000"
```
<br>

### Updating paths AND trackers
Note: tracker and path updates are not linked. They run as independent operations!
```bash
node ./dist --existing-path "/downloads/films" --new-path "/torrents/movies" --existing-tracker "http://some-tracker.com:6969" --new-tracker "https://some-tracker.com:5000"
```
This will change the paths from `/downloads/films` -> `/torrents/movies` on any matching torrents and `http://some-tracker.com:6969` -> `https://some-tracker.com:5000` on any matching torrents.
<br>

## Important notes
- Currently, these tools only work on the experimental torrents.db resumedata file you can toggle in the Advanced Settings in qBittorrent.
- By default, a timestamped backup of the resumedata will be created before processing changes. You can disable this by passing `--disable-backup`.
- "/" path separators have been compatible with Windows for a long time and it doesn't matter for qBittorrent (it actually saves some Windows paths with '/' separators). To simplify things, this tool will only use '/' for all new paths regardless of OS.
- Be careful if you are updating partial paths that may share segments with others. e.g. `--existing-path "C:\torrents\movie"` will match both `C:\torrents\movie uploads` and `C:\torrents\movies` directories.
- Avoid replacing a single word as it will replace it anywhere in the libtorrent data blob. This will mess up file name data. Include a path separator.
- If you end a string with a slash, use care to include a slash at the end of the new string, otherwise it will remove it.
- You have to run the command for each path you want to change.
- Make sure to wrap the paths in quotes.
- Git bash/MINGW64 on Windows: mingw messes up partial paths starting with "/" and makes them local to the git program directory. See [here](https://github.com/moby/moby/issues/24029#issuecomment-250412919). Run the command with command prompt or powershell instead.

## Why

I switched to the experimental SQLite database in qBittorrent a while and wanted to update save paths for my torrents so I could migrate from Windows to Linux. Every existing tool I could find only worked on the .fastresume files. Rather than switch back to .fastresume files I decided to write tools to work with the database. :)

Why TypeScript: I'm more experienced with it. I actually started this project as a Rust app as a way to learn the language, but since I needed it ASAP for a NAS migration I decided to quickly write it in TypeScript. When I'm done with the Rust app I'll toss that on Github too.

## Types

I created types for the SQLite database rows as well as for the Bencoded libtorrent_resume_data blob if you need to import them for other projects.
