# Easy Auto Attach

## Install

1. Install this package:
    ```shell
    $ npm i -g easy-auto-attach
    ```
2. Convigure VS Code:
    ```shell
    $ easy-auto-attach install <VS Code Path>
    ```

    1. Install VS Code Extension: https://marketplace.visualstudio.com/items?itemName=hediet.vscode-rpc-server
    2. Apply VS Code Settings (settings.json):
		```json
		{
			...
			"rpcServer.showStartupMessage": false,
		 	"rpcServer.nodeDebugger.autoAttachLabels": ["easy-auto-attach"]`
		}
		 ```
    3. 

3. Add this line to the earliest part of your application or script:
    ```shell
    $ require('easy-auto-attach')()
    ```

## Scope to Workspace

### Option 1

1. Get auto-attach label:
    - checks for workspace config to get label
    - falls back to global config
    - falls back to default "easy-auto-attach"
2. Apply label to VS Code config.
    - if config came from workspace config, apply to workspace settings
    - else apply to global settings

### Option 2

Inside initialization, do the following:

1. Set `workspaceLabel` to something unique (directory, workspace name, etc.)
2. Set `options.label` to `workspaceLabel`
3. Update VS Code workspace settings.json:
    ```json
    {
        ...
        "rpcServer.nodeDebugger.autoAttachLabels": [${workspaceLabel}]
    }
    ```