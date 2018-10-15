# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.3.4](N/A) - 2018-10-14
#### Changed
* Update to TypeScript 3.1
* Update dev dependencies and @types
* Enable tsconfig.json strict and fix compile errors
* Removed compiled bin tarball in favor of git tags and github releases


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
* Renamed `Task` `_status` -> `state` and `_name` -> `name` and removed `status` and `name` getters infavor of readonly properties behind TaskResults.Task interface, callers should no longer import Task directly, instead use the new Task.newTask() method
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