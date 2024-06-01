import fs from "fs";
import jimp from "jimp";
import path from "path";
const __dirname = path.resolve();

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`inputURL: ${inputURL}`);
      const photo = await jimp.read(inputURL);
      const outpath = path.join(
        __dirname,
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg"
      );
      console.log(`outpath: ${outpath}`);
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (_) => {
          resolve(outpath);
        });
    } catch (error) {
      console.log(`error: ${error.message}`);
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  try {
    for (let file of files) {
      fs.unlinkSync(file);
    }
  } catch (error) {
    console.log(`Cannot unlink file: ${error.message}`);
  }
}
