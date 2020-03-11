# Change Log

All notable changes to the "redi" extension will be documented in this file.

## [Unreleased]

* Secure config so passwords aren't plain text - would be nice to use machine's vault
* virtual docs for server settings
* virtual docs for key values
* support of ":" virtual folders
* use groups to organise servers

* speed needs addessing - it's slow to enumerate servers and then keys

* some tests wold be nice 

* ability to filter on key
* ability to filter on values..? (will be slow but maybe killer feature)

* favourites per server - can set key or "folder" as a favourite then button on server to toggle between favourites or all/filter

## [0.0.4] - 2020-03-11
## Changed
restructured code to use more async


## [0.0.3] - 2020-03-10
### Added
Ability to show all servers from global config in tree view
View keys inside of servers

### Changed
project name changed to redi

### Deprecated
nothing

### Removed
all references to sortis

### Fixed
initialisation sorted out

### Security
no change - still unsafe passwords stored in plain text in config file - it will be fixed, somehow