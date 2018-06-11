# YTFetcher-Web

A client for [GoYTFetcher](https://github.com/Grarak/GoYTFetcher)

## Installation

#### Dependencies

* **nodejs** (v8 or higher)

#### Build

```
$ git clone https://github.com/Grarak/YTFetcher-Web.git
$ cd YTFetcher-Web
$ npm install -g @angular/cli
$ npm install
$ ng build --prod --build-optimizer
```

Compiled files will be stored in dist folder.

## Usage

By using the -i flag of [GoYTFetcher](https://github.com/Grarak/GoYTFetcher) you can host your website.
Just set the -i flag to the output folder (dist/YTFetcher-Web)

```
$ GoYTFetcher -i <path>/dist/YTFetcher-Web
```
