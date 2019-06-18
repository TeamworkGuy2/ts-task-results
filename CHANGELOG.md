# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.4.0](N/A) - 2019-06-17
#### Added
* Static `Task.isRunning()` and `Task.isSettled()` methods

#### Changed
* `TaskState` interface is now a string literal union type of possible `Task.state` options
* Update to TypeScript 3.5 and fix compile errors

#### Removed
* `TaskState` in favor of just using strings and `Task.isRunning()` and `Task.isSettled()`


--------
### [0.3.11](https://github.com/TeamworkGuy2/ts-task-results/commit/bdc8a685ae91c4e2868af664e60c3a5008bbc432) - 2019-05-17
#### Changed
* Update dependency `ts-mortar@0.17.0` (Arrays fixes/cleanup)


--------
### [0.3.10](https://github.com/TeamworkGuy2/ts-task-results/commit/b4b615d77c8ccb3980c811f2a697626bb7aab91e) - 2019-05-10
#### Changed
* Removed package.json `@types/node` dependency, added tsconfig.json lib `dom`


--------
### [0.3.9](https://github.com/TeamworkGuy2/ts-task-results/commit/68101ba730cc662d3a13f9b6006102e7e383f5d1) - 2019-03-20
#### Added
* Added README.md example
* Added unit tests

#### Changed
* Switch `ts-mortar` and `ts-promises` dependencies from github to npm
* `TaskSet` interface and class getTaskStartedCallback(), getTaskCompletedCallback(), and getTaskFailedCallback() return types changed from `((taskName: string) => void) | undefined` to `((taskName: string) => void) | null`

#### Removed
* `Task.isPromise` property in favor of a `Task.isPromise()` check inside `start()`


--------
### [0.3.8](https://github.com/TeamworkGuy2/ts-task-results/commit/09e6fdbce921b0a6c063b1036382a761a4a58da3) - 2019-03-13
#### Changed
* Update dependency `ts-mortar@0.16.0` (fix for `Strings.isDigit()`, removal of `Objects.getProps()` and `Strings.endsWith()`, and several other changes)


--------
### [0.3.7](https://github.com/TeamworkGuy2/ts-task-results/commit/1061e14f9ecdfa55a55cbd7195897a6d106628d7) - 2018-12-29
#### Changed
* Update to TypeScript 3.2 and fix compile errors
* Update @types dependencies


--------
### [0.3.6](https://github.com/TeamworkGuy2/ts-task-results/commit/db9c764c9b355a22b3c8e662071d6dd19d471d88) - 2018-11-23
#### Changed
* Update dependency `ts-mortar@0.15.9` (fix for `Functions.lazy()` when initializer returns null) and `ts-promises@0.4.4` (PsPromise.then() type improvement)


--------
### [0.3.5](https://github.com/TeamworkGuy2/ts-task-results/commit/be96bd112290672ed4da06adef1743ec8ac6501e) - 2018-10-20
#### Changed
* Switch `package.json` github dependencies from tag urls to release tarballs to simplify npm install (doesn't require git to npm install tarballs)


--------
### [0.3.4](https://github.com/TeamworkGuy2/ts-task-results/commit/03e1a0a8dbd322faf217b1ecb11858717520026e) - 2018-10-14
#### Changed
* Update to TypeScript 3.1
* Update dev dependencies and @types
* Enable tsconfig.json strict and fix compile errors
* Removed compiled bin tarball in favor of git tags


--------
### [0.3.3](https://github.com/TeamworkGuy2/ts-task-results/commit/2bfc413d8d1264086c99c203e7e6217ccae639f7) - 2018-04-09
#### Changed
* Update to TypeScript 2.8, fix issues related to ts-promises vs Q and TypeScript lib.d.ts promises.
* Update tsconfig.json with `noImplicitReturns: true` and `forceConsistentCasingInFileNames: true`
* Added release tarball and npm script `build-package` to package.json referencing external process to generate tarball


--------
### [0.3.2](https://github.com/TeamworkGuy2/ts-task-results/commit/2616143e120681a2463d821238f1fd53eb015743) - 2018-03-01
#### Changed
* Update to TypeScript 2.7
* Update dependencies: mocha, @types/chai, @types/mocha, @types/node, @types/q
* Enable tsconfig.json `noImplicitAny`


--------
### [0.3.1](https://github.com/TeamworkGuy2/ts-task-results/commit/aabed012252a80678d72fb1c755b9b8cf81554c2) - 2017-11-16
#### Changed
* Fix `TaskSet` interface, add missing `getCompletedTaskCount()`
* Add `task-results.d.ts` reference to `Tasks.ts`


--------
### [0.3.0](https://github.com/TeamworkGuy2/ts-task-results/commit/0c2345d69f39e38225b71dfd13446a817a548807) - 2017-11-14
#### Changed
* `package.json` added `strictNullChecks` and enabled `noImplicitThis` and fixed code to work with these flags
* Added/improved `Task and `TaskSet` interfaces to match their implementations
* Changed Task constructor() from private to public


--------
### [0.2.0](https://github.com/TeamworkGuy2/ts-task-results/commit/c52c8840d7f91e9d00261384e213c368a0cf70e0) - 2017-08-06
#### Changed
* `Results.resultOrError()` now determines `hasResult` based on whether error is null or not, not whether result is not null as previously
* Renamed `TaskStatus` -> `TaskState`
* Rename `Task.status` -> `Task.state`
* `Task` now `implements TaskResults.Task` interface
* `TaskState` implements `TaskResults.TaskState` interface
* Renamed `Task` `_status` -> `state` and `_name` -> `name` and removed `status` and `name` getters in favor of readonly properties behind TaskResults.Task interface, callers should no longer import Task directly, instead use the new Task.newTask() method
* Update to TypeScript 2.4 support


--------
### [0.1.6](https://github.com/TeamworkGuy2/ts-task-results/commit/e45e1ebad2a012a385199ff06d216864930980a6) - 2017-05-09
#### Changed
* Update to TypeScript 2.3, add tsconfig.json, use @types/ definitions
* Update documentation to work better with Visual Studio


--------
### [0.1.5](https://github.com/TeamworkGuy2/ts-task-results/commit/fbcf39949f39fe6ca8f11fb453a8d49440cab2c2) - 2016-09-27
#### Added
* TaskSet support for accessing the list of completed tasks and controlling the size and clearing behavior of the list of completed tasks
  * new maxCompletedTasks and dropCompletedTasksPercentage public properties (these are public, but may be moved to getters/setters or get renamed in future)
  * new getCompletedTasks(), clearCompletedTasks(), and getCompletedTaskCount() methods


--------
### [0.1.4](https://github.com/TeamworkGuy2/ts-task-results/commit/277d8f51441b3ceec8bb0d592efffb7bf9f8e109) - 2016-09-24
#### Added
* Added `TaskSet` for creating and handling lists of Tasks

#### Removed
 * `Task.newInst()` - use `new Task()`


--------
### [0.1.3](https://github.com/TeamworkGuy2/ts-task-results/commit/7b1ce2a24f891e562a88fe330984c6204a6168ed) - 2016-09-19
#### Changed
* Updated dependencies 'ts-mortar' to 0.11.0, 'q' to 1.4.1, and 'mocha' to 3.0.2 latest versions


--------
### [0.1.2](https://github.com/TeamworkGuy2/ts-task-results/commit/f75b9c2682b0f5e85986e8791e85311281c3ccc9) - 2016-05-28
#### Changed
* Switched unit tests from qunit to chai and mocha and moved test/task/ test files into root test/ directory


--------
### [0.1.1](https://github.com/TeamworkGuy2/ts-task-results/commit/84d099bc92572e687dbd8889f4182773b8a17690) - 2016-05-25
#### Changed
* Updated to use latest version of EnumCreator from ts-mortar


--------
### [0.1.0](https://github.com/TeamworkGuy2/ts-task-results/commit/46cb886b4855c665226347d0a1f3251f0f040fdc) - 2016-05-24
#### Added
Initial commit of `Task`, `TaskStatus`, and `Results`