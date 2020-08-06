---
layout: default
title: "Packages"
description: "Export and install first-gen packages."
---

# Packages
Pony currently handles installation of first-gen packages.

You can find first-gen packages in the file `data/groups/packages.json`.
This file is a simple JSON which maps a name of a package group to 
a list of package definitions. 
Each package definition has to include at least `SubscriberPackageName` and `SubscriberPackageVersionId`.
If you have some org with all packages installed, use `sfdx pony:package:group:export` to create this file.
This command automatically removes standard packages, 
please open an [issue](https://github.com/pony-ci/sfdx-plugin/issues) if some standard package is not removed.
```json
{
    "default": [
        {
            "SubscriberPackageName": "Package Name",
            "SubscriberPackageVersionId": "04t..."
        }       
    ]
}
``` 