---
layout: default
title: "Project Structure"
description: "See how Pony project looks like."
---

The core config file for pony projects is `.pony/config.yml`.
This file includes job definitions, source replacements and data export/import configuration.
Directories `data/` and `scripts/` contains files essential for 
the creation of fully configured scratch orgs.
```
.
├── .pony
│   └── config.yml
├── config
│   └── project-scratch-def.json
├── data
│   ├── groups
│   │   └── packages.json
│   └── sObjects
│       ├── Account.json
│       └── Contact.json
└── force-app (src)
│   └── main
│       └── default
│           ├── classes
│           └── lwc
├── sfdx-project.json
└── scripts
    ├── apex
    │   └── insertCustomSettings.apex
    └── soql
        └── export
            ├── Account.soql
            └── Contact.soql

```