import { InstallArgs, PackageInstaller, uninstallModLoader } from "./PackageInstaller";
import path from "../providers/node/path/path";
import FsProvider from "../providers/generic/file/FsProvider";
import { MODLOADER_PACKAGES } from "../r2mm/installing/profile_installers/ModLoaderVariantRecord";
import { PackageLoader } from "../model/schema/ThunderstoreSchema";
import ecosystem from "src/boot/ecosystem";
import GameManager from "src/model/game/GameManager";

const basePackageFiles = ["manifest.json", "readme.md", "icon.png"];

export class BepInExInstaller implements PackageInstaller {
    /**
     * Handles installation of BepInEx
     */
    async install(args: InstallArgs) {
        const {
            mod,
            packagePath,
            profile,
        } = args;

        const mapping = MODLOADER_PACKAGES.find((entry) => entry.packageName.toLowerCase() == mod.getName().toLowerCase());
        const mappingRoot = mapping ? mapping.rootFolder : "";

        let bepInExRoot: string;
        if (mappingRoot.trim().length > 0) {
            bepInExRoot = path.join(packagePath, mappingRoot);
        } else {
            bepInExRoot = path.join(packagePath);
        }
        for (const item of (await FsProvider.instance.readdir(bepInExRoot))) {
            if (!basePackageFiles.includes(item.toLowerCase())) {
                const isDirectory = (await FsProvider.instance.stat(path.join(bepInExRoot, item))).isDirectory();

                if (isDirectory && item === "winhttp_libs") {
                    for (const subItem of (await FsProvider.instance.readdir(path.join(bepInExRoot, item)))) {
                        const isFile = (await FsProvider.instance.stat(path.join(bepInExRoot, item, subItem))).isFile();
                        const architecture = GameManager.activeGame.activePlatform.storeArchitecture;
                        if (architecture !== undefined) {
                            if (architecture === "x86") {
                                if (isFile && subItem === "winhttp_x86.dll") {
                                    await FsProvider.instance.copyFile(path.join(bepInExRoot, item, subItem), profile.joinToProfilePath("winhttp.dll"));
                                } 
                            } else if (architecture === "x64") {
                                if (isFile && subItem === "winhttp_x64.dll") {
                                    await FsProvider.instance.copyFile(path.join(bepInExRoot, item, subItem), profile.joinToProfilePath("winhttp.dll"));
                                }
                            }
                            continue;
                        }
                    }
                }
                if ((await FsProvider.instance.stat(path.join(bepInExRoot, item))).isFile()) {
                    await FsProvider.instance.copyFile(path.join(bepInExRoot, item), profile.joinToProfilePath(item));
                } else {
                    await FsProvider.instance.copyFolder(path.join(bepInExRoot, item), profile.joinToProfilePath(item));
                }
            }
        }
    }

    async uninstall(args: InstallArgs) {
        await uninstallModLoader(args.mod, args.profile);
    }
}
