# Usage

The module can be used as API (some of the functions are [Promise](http://bluebirdjs.com/docs/api-reference.html) based).

## Limitations

None known yet.

## Using Custom Logger

It is usual that you use an own `logger` in your application. This module 
supports you by letting you inject your logger as constructor argument to the 
`LogAdapter` object.

If you do not provide one, then the default logger is `console`.

```javascript
TODO
```

At least, the passed `logger` object _has_ to support the following functions:

```javascript
function info(msg)
function debug(msg)
function trace(msg)
function error(err|msg)
```
Anyway, there are some fallbacks if a level is not supported:

- DEBUG ⇒ INFO
- TRACE ⇒ DEBUG

# Contributing

Pull requests and stars are always welcome. Anybody is invited to take part 
into this project. For bugs and feature requests, please create an 
[issue](https://github.com/deadratfink/log-adapter/issues).
See the wiki [Contributing](https://github.com/deadratfink/log-adapter/wiki/Changelog) 
section for more details about conventions.

# Changelog

The complete changelog is listed in the wiki [Changelog](https://github.com/deadratfink/log-adapter/wiki/Changelog) section.

