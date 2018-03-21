# Internezzo.ChildReload

Sometimes the rendering of your base node depends on the number of child nodes underneath it. So when adding or removing children, you would want your whole page to reload. This package helps you to accomplish just that.

## Usage

1. `composer require internezzo/childreload`
2. Modify your base nodetype like this:

```
'YourVendor:YourBaseNodeType':
  options:
    reloadIfChildChanged: true
```

Voila! When any of the child nodes were added or removed, the page would reload.

**The package only works with the modern Neos UI starting with Neos 3.3**

## Development

Go to `Resources/Private/JavaScript/ChildReload` and run `yarn watch` or `yarn build` to recompile the JS assets.
