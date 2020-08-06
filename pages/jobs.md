# Jobs
Job is a collection of steps.
You can define your own job which can be executed from another job or using `sfdx pony:run`.
Standard job extensions are prefixed with `pony`, e.g. `pony:preOrgCreate` and `pony:postSourcePush`,
these two jobs are executed before and after the `sfdx pony:org:create` command. 

There are five types of steps: `echo`, `env`, `job`, `run` and `sfdx`.

## Steps Overview


| type | example                           | description                   |
|------|-----------------------------------|-------------------------------|
| echo | `echo: running echo step`         | print to standard output      |
| env  | `env: myVariable=myValue`         | set pony environment variable |
| job  | `job: createTestUsers`            | execute job                   |
| run  | `npx eslint yourfile.js`          | execute shell                 |
| sfdx | `sfdx: force:org:list`            | shortcut for `run: sfdx`      |

## Environment
Jobs executed in one context share environment.
Set environment variable using the `env` step, e.g. `env: myVariable=myValue`,
and get access variable using `$env.myVariable` notation.
Some variables are set from commands, 
you can find which variables are set in each command documentation.
The most used variable you will use is a `username` variable
and is set in the `pony:org:create` command.

## Job example
In the example below, you can see defined three jobs and one replacement named `preSourcePush`.

1. Run the `pony:org:create` command to create a scratch org.  
Note that if you have default username set or provide `targetusername` flag,
no scratch org is created, the `username` env is set 
and the `pony:postOrgCreate` extension is executed immediately.
2. The `pony:postOrgCreate` extension is executed.  
2.1. Print a login url - can be used in CI system.  
2.2. Install first-gen packages.  
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
