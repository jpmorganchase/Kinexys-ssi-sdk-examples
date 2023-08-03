import fs from "fs";
import path from "path";

export const writeToFile = (fileLocationPath: string, content: string) => {
  try {
    fs.writeFileSync(fileLocationPath, content);
    console.log(
      `\nSaving the document under ${path.dirname(
        fileLocationPath
      )} directory\n`
    );
  } catch (error) {
    console.log("Failed to write file");
    console.error(error);
  }
};
