# Pony Project
Define jobs to automate your Salesforce development experience.
Simplify scratch org creation,
manage data export/import 
and get rid of custom script files 
using simple configuration file and sfdx plugin

## Table of Contents
- [Links](#links)
- [Project Structure](#project-structure)
- [Jobs](#jobs)
    - [Steps Overview](#steps-overview)
    - [Environment](#environment)
    - [Source Replacement](#source-replacement)
    - [Job Example](#job-example)
- [Packages](#packages)
- [Data Management](#data-management)
    - [Data Export](#data-export)
    - [Data Import](#data-import)
    
## Links
- [Docs](https://pony-ci.github.io/pony-ci)
- [Plugin Repository](https://github.com/pony-ci/sfdx-plugin)
- [Plugin Issues](https://github.com/pony-ci/sfdx-plugin/issues)

## Project Structure
The core config file for pony projects is `.pony/config.yml`.
This file includes job definitions, source replacements and data export/import configuration.
Directories `data/` and `scripts/` contains files essential for creation of fully configure scratch orgs.
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

## Jobs
Job is a collection of steps.
You can define your own job which can be executed from another job or using `sfdx pony:run`.
Standard job extensions are prefixed with `pony`, e.g. `pony:preOrgCreate` and `pony:postSourcePush`,
these two jobs are executed before and after the `sfdx pony:org:create` command. 

There are five types of steps: 'echo', 'env', 'job', 'run' and 'sfdx'.

### Steps Overview


| type | example                           | description                   |
|------|-----------------------------------|-------------------------------|
| echo | `echo: running echo step`         | print to standard output      |
| env  | `env: myVariable=myValue` | set pony environment variable |
| job  | `job: createTestUsers`            | execute job                   |
| run  | `npx eslint yourfile.js`          | execute shell                 |
| sfdx | `sfdx: force:org:list`            | shortcut for `run: sfdx`      |

### Environment
Jobs executed in one context share environment.
Set environment variable using the `env` step, e.g. `env: myVariable=myValue`,
and get access variable using `$env.myVariable` notation.
Some variables are set from commands, 
you can find which variables are set in each command documentation.
Most used variable you will use is a `username` variable
and is set in the `pony:org:create` command.

### Source Replacement
You can use replacements as a workaround for example when your source includes usernames 
that are not replaced automatically with admin username by `force:source:push`.
Each replacement has its name.
The replacement defined in [job example](#job-example) 
looks for inner texts in specified XML source files.
It searches for the specified search texts and replaces them with admin username using pony environment.

If the replacement runs in the `pony:preSourcePush` extension,
after the source is pushed, the content of these files is reverted.
Moreover, if the push is successful, 
the source path infos hashes are updated, so the files are not pushed again.
Now you can use the standard `force:source:push` command.
Note that you will again need to use the `pony:source:push`
if you modify one of these files locally.


| type                | description                                                                                      |
|---------------------|--------------------------------------------------------------------------------------------------|
| innerText           | replace matched inner text with predefined value                                                 |
| orgWideEmailAddress | replace `senderType` `OrgWideEmailAddress` value, remove `senderAddress` node                    |

### Job example
In the example bellow you can see defined three jobs and one replacement named `preSourcePush`.

1. Run the `pony:org:create` command to create a scratch org.  
Note that if you have default username set or provide `targetusername` flag,
no scratch org is created, the `username` env is set 
and the `pony:postOrgCreate` extension is executed immediately.
2. The `pony:postOrgCreate` extension is executed.  
2.1. Print a login url - can be used in CI system.  
2.2. Install First Gen packages.  
2.3. Execute `pony:source:push`.  
2.4. Execute `pony:preSourcePush` extension.
This extension executes [source replacement](#source-replacement).  
2.5. Source is pushed.  
2.6. Revert changed files, update source path info hashes.  
2.7. Execute Apex script, insert custom settings or execute some configuration in Apex. 
2.8. Import currency types.  
2.9. Execute custom job `createTestUsers`.  
2.10. List orgs.  

```yaml
jobs:
    pony:postOrgCreate:
        steps:
            -   sfdx: force:org:open -u $env.username --urlonly
            -   sfdx: pony:package:group:install -u $env.username
            -   sfdx: pony:source:push -u $env.username
            -   sfdx: force:apex:execute -u $env.username -f scripts/apex/insertCustomSettings.apex
            -   sfdx: force:data:tree:import -u $env.username -f data/CurrencyType.json
            -   sfdx: pony:data:import -u $env.username
            -   job: createTestUsers
            -   sfdx: force:org:list
    pony:preSourcePush:
        steps:
            -   sfdx: pony:source:content:replace -r preSourcePush
    createTestUsers:
        steps:
            -   sfdx: pony:user:create -u $env.username -f config/test-user-definition-file.json -p agent LastName=Agent ProfileName=Agent IsActive=false
            -   sfdx: pony:user:create -u $env.username -f config/test-user-definition-file.json -p std LastName=Standard ProfileName="Standard User" IsActive=false

replacements:
    preSourcePush:
        innerText:
            files:
                - force-app/main/default/approvalProcesses/Opportunity.Opportunity_Approval_Process.approvalProcess-meta.xml
                - force-app/main/default/approvalProcesses/Contract.Contract_Approval_Process.approvalProcess-meta.xml
            search:
                - some@username.com
                - another@username.com
            replacement: $env.username
        orgWideEmailAddress:
            files:
                - force-app/main/default/workflows/Case.workflow-meta.xml
            replacement: CurrentUser
```

## Packages
Pony currently handles installation of first gen packages.

You can find first gen packages in the file `data/groups/packages.json`.
This file is a simple json which maps a name of a package group to 
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

## Data Management
The `force:data:tree` is a great tool if you want to export/import records
that can be queried using single query.
This command is often not sufficient 
when the relationships between your records are more complicated.
For this purpose we bring you two commands, 
`pony:data:export` and `pony:data:import`,
which can handle import in a sequence.


### Data Export
To export data you will need soql files defining which records to exports.
These files should be in directory `scripts/soql/export/`
and can optionally be overridden using `soqlExportDir` option in the data export config.
You can specify which sObjects to export using `order` option in the data export config, 
default value is `reverseOrder` which reverses the import order.

To create base soql with all createable fields automatically 
use `pony:data:soql:query:create` command.
Now you can export records from configured org, e.g. sandbox or production,
using `sfdx pony:data:export`.
Exported records are by default in `data/sObjects/` 
and can be overridden using `recordsDir` option in the sObjects config. 

        
### Data Import
To import records, you will need at least the exported records and defined import order.
Look at the `relationships` in the example bellow. 
You can see that for some sObjects we have defined some relationship fields.
For the Contact sObjects we are declaring to populate their `AccountId` fields
from accounts matched by `Name` fields.
There are two key things to bear in mind, accounts must be imported before contacts 
(`Account` must precede `Contact` in import order) 
and `Account.Name` field should be unique and required.

All records of a specific type are deleted before import in reversed import order.
You can turn off this feature, set `deleteBeforeImport` to `false` in the data import config,
other option is to list specific sObject types.
To delete only some records of specific type, create soql file in the `scripts/soql/delete`,
this directory can be changed using `soqlDeleteDir` option also in the data import config.

By default, records are inserted in chunks of 200, this can be changed using `chunkSize` option.

Basic data configuration shown bellow.

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