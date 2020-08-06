---
layout: default
title: "Data Management"
description: "Manage you data."
---

# Data Management
The `force:data:tree` is a great tool if you want to export/import records
that can be queried using a single query.
This command is often not sufficient 
when the relationships between your records are more complicated.
For this purpose, we bring you two commands, 
`pony:data:export` and `pony:data:import`,
which can handle import in a sequence.


## Data Export
To export data, you will need soql files defining which records to exports.
These files should be in directory `scripts/soql/export/`
and can optionally be overridden using `soqlExportDir` option in the data export config.
You can specify which sObjects to export using `order` option in the data export config, 
the default value is `reverseOrder` which reverses the import order.

To create base soql with all creatable fields automatically 
use `pony:data:soql:query:create` command.
Now you can export records from configured org, e.g. sandbox or production,
using `sfdx pony:data:export`.
Exported records are by default in `data/sObjects/` 
and can be overridden using `recordsDir` option in the sObjects config. 

        
## Data Import
To import records, you will need at least the exported records and defined import order.
Look at the `relationships` in the example below. 
You can see that for some sObjects we have defined some relationship fields.
For the Contact sObjects we are declaring to populate their `AccountId` fields
from accounts matched by `Name` fields.
There are two key things to bear in mind; accounts must be imported before contacts 
(`Account` must precede `Contact` in import order) 
and `Account.Name` field should be unique and required.

All records of a specific type are deleted before import in reversed import order.
You can turn off this feature, set `deleteBeforeImport` to `false` in the data import config,
another option is to list specific sObject types.
To delete only some records of a specific type, create soql file in the `scripts/soql/delete`,
this directory can be changed using `soqlDeleteDir` option also in the data import config.

By default, records are inserted in chunks of 200. Chunk size can be changed using `chunkSize` option.

```yaml
data:
    sObjects:
        import:
            order:
                - Account
                - Contact
                - Pricebook2
                - Opportunity
                - Product2
                - PricebookEntry
                - OpportunityLineItem
            deleteBeforeImport:
                - Case
                - OpportunityLineItem
                - Product2
                - Opportunity
                - Pricebook2
                - Contact
                - Account
            relationships:
                Contact:
                    - Account.Name
                Opportunity:
                    - Account.Name
                    - Pricebook2.Name
                PricebookEntry:
                    - Pricebook2.Name
                    - Product2.Name
                OpportunityLineItem:
                    - Product2.Name
                    - Opportunity.Name
```