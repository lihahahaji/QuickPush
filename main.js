const { app, Tray, Menu, nativeImage } = require("electron");
const path = require("path");
const { stdout } = require("process");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

let tray;

const { Notification } = require("electron");


app.whenReady().then(() => {
    app.dock.hide();
    const resourcesPath = app.getAppPath();
	const icon = nativeImage.createFromPath(resourcesPath+"/dist/tray_icon.png");
	tray = new Tray(icon);

    // const resourcesPath = app.getAppPath();
	// 获取实际程序中 cpp 目录的文件路径
	const resPath = resourcesPath.substring(0, resourcesPath.lastIndexOf('/'));
	// process.chdir(distPath);

	// 注意: 你的 contextMenu, Tooltip 和 Title 代码需要写在这里!
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "同步 HajiNote",
			click: async () => {
				
				const cmd = resPath+"/script/update";
                console.log(cmd)

				try {
                    const { stdout, stderr } = await exec(cmd);
                    new Notification({
                        title: "同步成功",
                        body: stdout,
                    }).show();
                    
                } catch (e) {
                    new Notification({
                        title: "同步失败",
                        body: e.stderr,
                    }).show();
                    console.log(e.stderr)
                }
			},
		},
	]);
	tray.setContextMenu(contextMenu);
});
