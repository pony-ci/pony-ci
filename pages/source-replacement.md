# Source Replacement
You can use replacements as a workaround for example when your source includes usernames 
that are not replaced automatically with admin username by `force:source:push`.
Each replacement has its name.
The replacement defined in [job example](pages/jobs.md#job-example) 
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
| innerText           | replace matched inner text with a predefined value                                                 |
| orgWideEmailAddress | replace `senderType` `OrgWideEmailAddress` value, remove `senderAddress` node                    |

